import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type PairingCodeDocument = HydratedDocument<PairingCode>;
export declare class PairingCode {
    code: string;
    caregiverId: Types.ObjectId;
    parentId?: Types.ObjectId;
    expiresAt: Date;
    usedAt?: Date;
}
export declare const PairingCodeSchema: MongooseSchema<PairingCode, import("mongoose").Model<PairingCode, any, any, any, any, any, PairingCode & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PairingCode, import("mongoose").Document<unknown, {}, PairingCode, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PairingCode & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    code?: import("mongoose").SchemaDefinitionProperty<string, PairingCode, import("mongoose").Document<unknown, {}, PairingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    caregiverId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PairingCode, import("mongoose").Document<unknown, {}, PairingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    parentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, PairingCode, import("mongoose").Document<unknown, {}, PairingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, PairingCode, import("mongoose").Document<unknown, {}, PairingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    usedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PairingCode, import("mongoose").Document<unknown, {}, PairingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PairingCode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, PairingCode>;
