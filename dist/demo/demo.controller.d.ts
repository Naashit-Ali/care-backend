import type { AuthUser } from '../common/auth.service.js';
import { DosesService } from '../doses/doses.service.js';
import { MedicinesService } from '../medicines/medicines.service.js';
export declare class DemoController {
    private doses;
    private medicines;
    constructor(doses: DosesService, medicines: MedicinesService);
    miss(user: AuthUser, id: string): Promise<import("../doses/dose.schema.js").Dose & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    doseSoon(user: AuthUser, id: string): Promise<import("../doses/dose.schema.js").Dose & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
