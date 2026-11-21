import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import type { AuthUser } from '../common/auth.service.js';
import { atTime, dayString, hhmm } from '../common/utils/time.js';
import { env } from '../env.js';
import { Medicine, MedicineDocument, scheduleStart } from '../medicines/medicine.schema.js';
import { Parent } from '../parents/parent.schema.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { Dose, DoseDocument } from './dose.schema.js';

@Injectable()
export class DosesService {
  constructor(
    @InjectModel(Dose.name) private doses: Model<Dose>,
    @InjectModel(Medicine.name) private medicines: Model<Medicine>,
    @InjectModel(Parent.name) private parents: Model<Parent>,
    private realtime: RealtimeGateway,
  ) {}

  /**
   * Upserts the medicine's doses for `day`. Times before the medicine was created (or its schedule
   * last edited) are skipped, so a new/edited medicine or a server restart never produces
   * instantly-missed doses.
   */
  async generateForMedicine(med: MedicineDocument, day = new Date()) {
    const notBefore = scheduleStart(med);
    for (const t of med.times) {
      const scheduledAt = atTime(day, t);
      if (scheduledAt <= notBefore) continue;
      await this.doses.updateOne(
        { medicineId: med._id, scheduledAt },
        {
          $setOnInsert: {
            parentId: med.parentId,
            caregiverId: med.caregiverId,
            medicineName: med.name,
            dose: med.dose,
            critical: med.critical,
            date: dayString(day),
            status: 'pending',
          },
        },
        { upsert: true },
      );
    }
  }

  async generateToday() {
    const activeParents = await this.parents.find({ status: 'active' }).distinct('_id');
    const meds = await this.medicines.find({ active: true, parentId: { $in: activeParents } });
    for (const med of meds) await this.generateForMedicine(med as MedicineDocument);
    for (const id of activeParents) this.realtime.toParent(String(id), 'schedule:updated', {});
  }

  async today(parentId: string) {
    const activeMedicines = await this.medicines.find({ parentId, active: true }).distinct('_id');
    return this.doses
      .find({ parentId, date: dayString(), medicineId: { $in: activeMedicines } })
      .sort({ scheduledAt: 1 })
      .lean();
  }

  async findOwned(user: AuthUser, doseId: string) {
    if (!isValidObjectId(doseId)) throw new NotFoundException('Dose not found');
    const dose = await this.doses.findById(doseId);
    if (!dose) throw new NotFoundException('Dose not found');
    const owner = user.role === 'caregiver' ? dose.caregiverId : dose.parentId;
    if (String(owner) !== user.id) throw new ForbiddenException();
    return dose;
  }

  async take(user: AuthUser, doseId: string) {
    const dose = await this.findOwned(user, doseId);
    if (dose.status === 'taken') return dose.toObject();
    if (dose.status === 'pending') {
      const minutes = env.takeWindowBeforeMinutes;
      const opensAt = new Date(dose.scheduledAt.getTime() - minutes * 60_000);
      if (Date.now() < opensAt.getTime()) {
        throw new BadRequestException(
          `Too early. You can mark this as taken from ${hhmm(opensAt)} (${minutes} minutes before ${hhmm(dose.scheduledAt)}).`,
        );
      }
    }
    const updated = await this.doses
      .findOneAndUpdate(
        { _id: dose._id, status: { $in: ['pending', 'missed'] } },
        { status: 'taken', takenAt: new Date() },
        { new: true },
      )
      .lean();
    if (!updated) throw new BadRequestException('Dose cannot be taken');
    this.emitUpdated(updated);
    const parent = await this.parents.findById(updated.parentId).select('name').lean();
    this.realtime.toCaregiver(String(updated.caregiverId), 'dose:taken', {
      ...updated,
      parentName: parent?.name ?? '',
      late: dose.status === 'missed',
    });
    return updated;
  }

  /** Atomic pending → missed, so one dose never alerts twice. */
  async markMissed(dose: Pick<DoseDocument, '_id'>) {
    const updated = await this.doses
      .findOneAndUpdate({ _id: dose._id, status: 'pending' }, { status: 'missed', missedAt: new Date() }, { new: true })
      .lean();
    if (!updated) return null;

    const parent = await this.parents.findById(updated.parentId).select('name').lean();
    this.emitUpdated(updated);
    this.realtime.toCaregiver(String(updated.caregiverId), 'dose:missed', {
      ...updated,
      parentName: parent?.name ?? '',
    });
    // PHASE 2 hook: this.agent?.onDoseMissed(updated)
    return updated;
  }

  async markOverdueMissed() {
    const cutoff = new Date(Date.now() - env.missedGraceMinutes * 60_000);
    const overdue = await this.doses.find({ status: 'pending', scheduledAt: { $lt: cutoff } }).select('_id');
    for (const d of overdue) await this.markMissed(d);
  }

  /** Deleted medicine: drop every pending dose so nothing is reminded or marked missed later. */
  async removePending(medicineId: Types.ObjectId) {
    await this.doses.deleteMany({ medicineId, status: 'pending' });
  }

  /**
   * Edited medicine: drop pending doses whose time was removed, copy the new name/dose/critical
   * onto today's doses, then create doses for any new times later today.
   */
  async syncAfterEdit(med: MedicineDocument) {
    const pending = await this.doses.find({ medicineId: med._id, status: 'pending' }).select('scheduledAt');
    const stale = pending.filter((d) => !med.times.includes(hhmm(d.scheduledAt))).map((d) => d._id);
    if (stale.length) await this.doses.deleteMany({ _id: { $in: stale } });

    await this.doses.updateMany(
      { medicineId: med._id, date: { $gte: dayString() } },
      { medicineName: med.name, dose: med.dose, critical: med.critical },
    );
    await this.generateForMedicine(med);
  }

  /** Demo helper: a one-off pending dose `minutes` from now. */
  async createSoon(med: MedicineDocument, minutes = 1) {
    const scheduledAt = new Date(Date.now() + minutes * 60_000);
    scheduledAt.setSeconds(0, 0);
    const dose = await this.doses.create({
      medicineId: med._id,
      parentId: med.parentId,
      caregiverId: med.caregiverId,
      medicineName: med.name,
      dose: med.dose,
      critical: med.critical,
      date: dayString(scheduledAt),
      scheduledAt,
      status: 'pending',
    });
    const obj = dose.toObject();
    this.emitUpdated(obj);
    this.realtime.toParent(String(med.parentId), 'schedule:updated', {});
    return obj;
  }

  private emitUpdated(dose: { caregiverId: Types.ObjectId; parentId: Types.ObjectId }) {
    this.realtime.toCaregiver(String(dose.caregiverId), 'dose:updated', dose);
    this.realtime.toParent(String(dose.parentId), 'dose:updated', dose);
  }
}
