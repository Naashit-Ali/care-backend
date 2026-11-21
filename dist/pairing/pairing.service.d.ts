import { Model, Types } from 'mongoose';
import { PairingCode } from './pairing-code.schema.js';
export declare class PairingService {
    private codes;
    constructor(codes: Model<PairingCode>);
    create(caregiverId: string, parentId?: string): Promise<{
        code: string;
        expiresAt: Date;
    }>;
    consume(code: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, PairingCode, {}, import("mongoose").DefaultSchemaOptions> & PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, PairingCode, {}, import("mongoose").DefaultSchemaOptions> & PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {}, PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
}
