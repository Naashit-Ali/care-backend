import type { AuthUser } from '../common/auth.service.js';
import { ParentsService } from './parents.service.js';
declare class JoinDto {
    name: string;
    code: string;
}
export declare class ParentsController {
    private parents;
    constructor(parents: ParentsService);
    join(dto: JoinDto): Promise<{
        id: string;
        name: string;
        token: string;
        status: import("./parent.schema.js").ParentStatus;
    }>;
    me(user: AuthUser): {
        id: string;
        name: string;
        status: import("./parent.schema.js").ParentStatus;
        caregiverId: string;
    };
    signOut(user: AuthUser): Promise<{
        ok: boolean;
    }>;
    reconnectCode(user: AuthUser, id: string): Promise<{
        code: string;
        expiresAt: Date;
    }>;
    list(user: AuthUser): import("mongoose").Query<(import("./parent.schema.js").Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, import("./parent.schema.js").Parent, {}, import("mongoose").DefaultSchemaOptions> & import("./parent.schema.js").Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./parent.schema.js").Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "find", {}, import("./parent.schema.js").Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    approve(user: AuthUser, id: string): Promise<import("./parent.schema.js").Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    reject(user: AuthUser, id: string): Promise<import("./parent.schema.js").Parent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
export {};
