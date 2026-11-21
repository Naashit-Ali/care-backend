import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import type { AuthUser } from '../common/auth.service.js';
import { DosesService } from '../doses/doses.service.js';
import { ParentsService } from '../parents/parents.service.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/create-medicine.dto.js';
import { Medicine, MedicineDocument } from './medicine.schema.js';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectModel(Medicine.name) private medicines: Model<Medicine>,
    private parents: ParentsService,
    private doses: DosesService,
    private realtime: RealtimeGateway,
  ) {}

  async create(user: AuthUser, parentId: string, dto: CreateMedicineDto) {
    const parent = await this.parents.getAccessible(user, parentId);
    if (parent.status !== 'active') throw new BadRequestException('Parent is not approved yet');

    const med = (await this.medicines.create({
      parentId: parent._id,
      caregiverId: parent.caregiverId,
      name: dto.name,
      dose: dto.dose,
      times: [...new Set(dto.times)].sort(),
      critical: dto.critical ?? false,
    })) as MedicineDocument;
    await this.doses.generateForMedicine(med);
    this.realtime.toParent(parentId, 'schedule:updated', {});
    return med.toObject();
  }

  async list(user: AuthUser, parentId: string) {
    await this.parents.getAccessible(user, parentId);
    return this.medicines.find({ parentId, active: true }).sort({ createdAt: 1 }).lean();
  }

  async findOwned(caregiverId: string, medicineId: string) {
    if (!isValidObjectId(medicineId)) throw new NotFoundException('Medicine not found');
    const med = await this.medicines.findById(medicineId);
    if (!med || !med.active) throw new NotFoundException('Medicine not found');
    if (String(med.caregiverId) !== caregiverId) throw new ForbiddenException();
    return med as MedicineDocument;
  }

  async update(caregiverId: string, medicineId: string, dto: UpdateMedicineDto) {
    const med = await this.findOwned(caregiverId, medicineId);
    if (dto.name !== undefined) med.name = dto.name;
    if (dto.dose !== undefined) med.dose = dto.dose;
    if (dto.critical !== undefined) med.critical = dto.critical;
    if (dto.times !== undefined) {
      const times = [...new Set(dto.times)].sort();
      if (times.join() !== med.times.join()) {
        med.times = times;
        med.scheduleFrom = new Date();
      }
    }
    await med.save();
    await this.doses.syncAfterEdit(med);
    this.notifyChanged(med);
    return med.toObject();
  }

  async remove(caregiverId: string, medicineId: string) {
    const med = await this.findOwned(caregiverId, medicineId);
    med.active = false;
    await med.save();
    await this.doses.removePending(med._id);
    this.notifyChanged(med);
    return { ok: true };
  }

  private notifyChanged(med: MedicineDocument) {
    this.realtime.toParent(String(med.parentId), 'schedule:updated', {});
    this.realtime.toCaregiver(String(med.caregiverId), 'schedule:updated', { parentId: String(med.parentId) });
  }
}
