import { Model } from 'mongoose';
import type { AuthUser } from '../common/auth.service.js';
import { DosesService } from '../doses/doses.service.js';
import { ParentsService } from '../parents/parents.service.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/create-medicine.dto.js';
import { Medicine, MedicineDocument } from './medicine.schema.js';
export declare class MedicinesService {
    private medicines;
    private parents;
    private doses;
    private realtime;
    constructor(medicines: Model<Medicine>, parents: ParentsService, doses: DosesService, realtime: RealtimeGateway);
    create(user: AuthUser, parentId: string, dto: CreateMedicineDto): Promise<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    list(user: AuthUser, parentId: string): Promise<(Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOwned(caregiverId: string, medicineId: string): Promise<MedicineDocument>;
    update(caregiverId: string, medicineId: string, dto: UpdateMedicineDto): Promise<Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(caregiverId: string, medicineId: string): Promise<{
        ok: boolean;
    }>;
    private notifyChanged;
}
