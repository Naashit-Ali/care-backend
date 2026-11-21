import type { AuthUser } from '../common/auth.service.js';
import { ParentsService } from '../parents/parents.service.js';
import { DosesService } from './doses.service.js';
export declare class DosesController {
    private doses;
    private parents;
    constructor(doses: DosesService, parents: ParentsService);
    today(user: AuthUser, parentId: string): Promise<(import("./dose.schema.js").Dose & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    take(user: AuthUser, id: string): Promise<import("./dose.schema.js").Dose & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
