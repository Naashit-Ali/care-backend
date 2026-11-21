import { Model, Types } from 'mongoose';
import type { AuthUser } from '../common/auth.service.js';
import { Medicine, MedicineDocument } from '../medicines/medicine.schema.js';
import { Parent } from '../parents/parent.schema.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { Dose, DoseDocument } from './dose.schema.js';
export declare class DosesService {
    private doses;
    private medicines;
    private parents;
    private realtime;
    constructor(doses: Model<Dose>, medicines: Model<Medicine>, parents: Model<Parent>, realtime: RealtimeGateway);
    generateForMedicine(med: MedicineDocument, day?: Date): Promise<void>;
    generateToday(): Promise<void>;
    today(parentId: string): Promise<(Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOwned(user: AuthUser, doseId: string): Promise<import("mongoose").Document<unknown, {}, Dose, {}, import("mongoose").DefaultSchemaOptions> & Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    take(user: AuthUser, doseId: string): Promise<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    markMissed(dose: Pick<DoseDocument, '_id'>): Promise<(Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    markOverdueMissed(): Promise<void>;
    removePending(medicineId: Types.ObjectId): Promise<void>;
    syncAfterEdit(med: MedicineDocument): Promise<void>;
    createSoon(med: MedicineDocument, minutes?: number): Promise<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    private emitUpdated;
}
