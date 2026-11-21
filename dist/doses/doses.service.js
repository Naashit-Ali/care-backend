var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { atTime, dayString, hhmm } from '../common/utils/time.js';
import { env } from '../env.js';
import { Medicine, scheduleStart } from '../medicines/medicine.schema.js';
import { Parent } from '../parents/parent.schema.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { Dose } from './dose.schema.js';
let DosesService = class DosesService {
    doses;
    medicines;
    parents;
    realtime;
    constructor(doses, medicines, parents, realtime) {
        this.doses = doses;
        this.medicines = medicines;
        this.parents = parents;
        this.realtime = realtime;
    }
    async generateForMedicine(med, day = new Date()) {
        const notBefore = scheduleStart(med);
        for (const t of med.times) {
            const scheduledAt = atTime(day, t);
            if (scheduledAt <= notBefore)
                continue;
            await this.doses.updateOne({ medicineId: med._id, scheduledAt }, {
                $setOnInsert: {
                    parentId: med.parentId,
                    caregiverId: med.caregiverId,
                    medicineName: med.name,
                    dose: med.dose,
                    critical: med.critical,
                    date: dayString(day),
                    status: 'pending',
                },
            }, { upsert: true });
        }
    }
    async generateToday() {
        const activeParents = await this.parents.find({ status: 'active' }).distinct('_id');
        const meds = await this.medicines.find({ active: true, parentId: { $in: activeParents } });
        for (const med of meds)
            await this.generateForMedicine(med);
        for (const id of activeParents)
            this.realtime.toParent(String(id), 'schedule:updated', {});
    }
    async today(parentId) {
        const activeMedicines = await this.medicines.find({ parentId, active: true }).distinct('_id');
        return this.doses
            .find({ parentId, date: dayString(), medicineId: { $in: activeMedicines } })
            .sort({ scheduledAt: 1 })
            .lean();
    }
    async findOwned(user, doseId) {
        if (!isValidObjectId(doseId))
            throw new NotFoundException('Dose not found');
        const dose = await this.doses.findById(doseId);
        if (!dose)
            throw new NotFoundException('Dose not found');
        const owner = user.role === 'caregiver' ? dose.caregiverId : dose.parentId;
        if (String(owner) !== user.id)
            throw new ForbiddenException();
        return dose;
    }
    async take(user, doseId) {
        const dose = await this.findOwned(user, doseId);
        if (dose.status === 'taken')
            return dose.toObject();
        if (dose.status === 'pending') {
            const minutes = env.takeWindowBeforeMinutes;
            const opensAt = new Date(dose.scheduledAt.getTime() - minutes * 60_000);
            if (Date.now() < opensAt.getTime()) {
                throw new BadRequestException(`Too early. You can mark this as taken from ${hhmm(opensAt)} (${minutes} minutes before ${hhmm(dose.scheduledAt)}).`);
            }
        }
        const updated = await this.doses
            .findOneAndUpdate({ _id: dose._id, status: { $in: ['pending', 'missed'] } }, { status: 'taken', takenAt: new Date() }, { new: true })
            .lean();
        if (!updated)
            throw new BadRequestException('Dose cannot be taken');
        this.emitUpdated(updated);
        const parent = await this.parents.findById(updated.parentId).select('name').lean();
        this.realtime.toCaregiver(String(updated.caregiverId), 'dose:taken', {
            ...updated,
            parentName: parent?.name ?? '',
            late: dose.status === 'missed',
        });
        return updated;
    }
    async markMissed(dose) {
        const updated = await this.doses
            .findOneAndUpdate({ _id: dose._id, status: 'pending' }, { status: 'missed', missedAt: new Date() }, { new: true })
            .lean();
        if (!updated)
            return null;
        const parent = await this.parents.findById(updated.parentId).select('name').lean();
        this.emitUpdated(updated);
        this.realtime.toCaregiver(String(updated.caregiverId), 'dose:missed', {
            ...updated,
            parentName: parent?.name ?? '',
        });
        return updated;
    }
    async markOverdueMissed() {
        const cutoff = new Date(Date.now() - env.missedGraceMinutes * 60_000);
        const overdue = await this.doses.find({ status: 'pending', scheduledAt: { $lt: cutoff } }).select('_id');
        for (const d of overdue)
            await this.markMissed(d);
    }
    async removePending(medicineId) {
        await this.doses.deleteMany({ medicineId, status: 'pending' });
    }
    async syncAfterEdit(med) {
        const pending = await this.doses.find({ medicineId: med._id, status: 'pending' }).select('scheduledAt');
        const stale = pending.filter((d) => !med.times.includes(hhmm(d.scheduledAt))).map((d) => d._id);
        if (stale.length)
            await this.doses.deleteMany({ _id: { $in: stale } });
        await this.doses.updateMany({ medicineId: med._id, date: { $gte: dayString() } }, { medicineName: med.name, dose: med.dose, critical: med.critical });
        await this.generateForMedicine(med);
    }
    async createSoon(med, minutes = 1) {
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
    emitUpdated(dose) {
        this.realtime.toCaregiver(String(dose.caregiverId), 'dose:updated', dose);
        this.realtime.toParent(String(dose.parentId), 'dose:updated', dose);
    }
};
DosesService = __decorate([
    Injectable(),
    __param(0, InjectModel(Dose.name)),
    __param(1, InjectModel(Medicine.name)),
    __param(2, InjectModel(Parent.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model,
        RealtimeGateway])
], DosesService);
export { DosesService };
//# sourceMappingURL=doses.service.js.map