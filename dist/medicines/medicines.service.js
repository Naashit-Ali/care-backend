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
import { DosesService } from '../doses/doses.service.js';
import { ParentsService } from '../parents/parents.service.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { Medicine } from './medicine.schema.js';
let MedicinesService = class MedicinesService {
    medicines;
    parents;
    doses;
    realtime;
    constructor(medicines, parents, doses, realtime) {
        this.medicines = medicines;
        this.parents = parents;
        this.doses = doses;
        this.realtime = realtime;
    }
    async create(user, parentId, dto) {
        const parent = await this.parents.getAccessible(user, parentId);
        if (parent.status !== 'active')
            throw new BadRequestException('Parent is not approved yet');
        const med = (await this.medicines.create({
            parentId: parent._id,
            caregiverId: parent.caregiverId,
            name: dto.name,
            dose: dto.dose,
            times: [...new Set(dto.times)].sort(),
            critical: dto.critical ?? false,
        }));
        await this.doses.generateForMedicine(med);
        this.realtime.toParent(parentId, 'schedule:updated', {});
        return med.toObject();
    }
    async list(user, parentId) {
        await this.parents.getAccessible(user, parentId);
        return this.medicines.find({ parentId, active: true }).sort({ createdAt: 1 }).lean();
    }
    async findOwned(caregiverId, medicineId) {
        if (!isValidObjectId(medicineId))
            throw new NotFoundException('Medicine not found');
        const med = await this.medicines.findById(medicineId);
        if (!med || !med.active)
            throw new NotFoundException('Medicine not found');
        if (String(med.caregiverId) !== caregiverId)
            throw new ForbiddenException();
        return med;
    }
    async update(caregiverId, medicineId, dto) {
        const med = await this.findOwned(caregiverId, medicineId);
        if (dto.name !== undefined)
            med.name = dto.name;
        if (dto.dose !== undefined)
            med.dose = dto.dose;
        if (dto.critical !== undefined)
            med.critical = dto.critical;
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
    async remove(caregiverId, medicineId) {
        const med = await this.findOwned(caregiverId, medicineId);
        med.active = false;
        await med.save();
        await this.doses.removePending(med._id);
        this.notifyChanged(med);
        return { ok: true };
    }
    notifyChanged(med) {
        this.realtime.toParent(String(med.parentId), 'schedule:updated', {});
        this.realtime.toCaregiver(String(med.caregiverId), 'schedule:updated', { parentId: String(med.parentId) });
    }
};
MedicinesService = __decorate([
    Injectable(),
    __param(0, InjectModel(Medicine.name)),
    __metadata("design:paramtypes", [Model,
        ParentsService,
        DosesService,
        RealtimeGateway])
], MedicinesService);
export { MedicinesService };
//# sourceMappingURL=medicines.service.js.map