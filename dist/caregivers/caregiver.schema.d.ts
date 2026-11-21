import { HydratedDocument } from 'mongoose';
export type CaregiverDocument = HydratedDocument<Caregiver>;
export declare class Caregiver {
    name: string;
    email?: string;
    passwordHash?: string;
    tokens: string[];
}
export declare const CaregiverSchema: import("mongoose").Schema<Caregiver, import("mongoose").Model<Caregiver, any, any, any, any, any, Caregiver & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Caregiver, import("mongoose").Document<unknown, {}, Caregiver, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Caregiver & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Caregiver, import("mongoose").Document<unknown, {}, Caregiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Caregiver & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | undefined, Caregiver, import("mongoose").Document<unknown, {}, Caregiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Caregiver & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    passwordHash?: import("mongoose").SchemaDefinitionProperty<string | undefined, Caregiver, import("mongoose").Document<unknown, {}, Caregiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Caregiver & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tokens?: import("mongoose").SchemaDefinitionProperty<string[], Caregiver, import("mongoose").Document<unknown, {}, Caregiver, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Caregiver & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Caregiver>;
