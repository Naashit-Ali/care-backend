import { Model } from 'mongoose';
import type { AuthUser } from '../common/auth.service.js';
import { PairingService } from '../pairing/pairing.service.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { Parent, ParentStatus } from './parent.schema.js';
export declare class ParentsService {
    private parents;
    private pairing;
    private realtime;
    constructor(parents: Model<Parent>, pairing: PairingService, realtime: RealtimeGateway);
    join(name: string, code: string): Promise<{
        id: string;
        name: string;
        token: string;
        status: ParentStatus;
    }>;
    private reconnect;
    createReconnectCode(caregiverId: string, parentId: string): Promise<{
        code: string;
        expiresAt: Date;
    }>;
    signOut(user: Extract<AuthUser, {
        role: 'parent';
    }>): Promise<{
        ok: boolean;
    }>;
    listForCaregiver(caregiverId: string): import("mongoose").Query<(Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, Parent, {}, import("mongoose").DefaultSchemaOptions> & Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "find", {}, Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    setStatus(caregiverId: string, parentId: string, status: ParentStatus): Promise<Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAccessible(user: AuthUser, parentId: string): Promise<Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
