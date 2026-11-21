import type { AuthUser } from '../common/auth.service.js';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/create-medicine.dto.js';
import { MedicinesService } from './medicines.service.js';
export declare class MedicinesController {
    private medicines;
    constructor(medicines: MedicinesService);
    create(user: AuthUser, parentId: string, dto: CreateMedicineDto): Promise<import("./medicine.schema.js").Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    list(user: AuthUser, parentId: string): Promise<(import("./medicine.schema.js").Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    update(user: AuthUser, id: string, dto: UpdateMedicineDto): Promise<import("./medicine.schema.js").Medicine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
