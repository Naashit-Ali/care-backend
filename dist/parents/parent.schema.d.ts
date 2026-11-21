import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type ParentStatus = 'pending' | 'active' | 'rejected';
export type ParentDocument = HydratedDocument<Parent>;
export declare class Parent {
    name: string;
    caregiverId: Types.ObjectId;
    token: string;
    status: ParentStatus;
    signedOutAt?: Date;
}
export declare const ParentSchema: MongooseSchema<Parent, import("mongoose").Model<Parent, any, any, any, any, any, Parent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Parent, import("mongoose").Document<unknown, {}, Parent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Parent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Parent, import("mongoose").Document<unknown, {}, Parent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Parent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    caregiverId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Parent, import("mongoose").Document<unknown, {}, Parent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Parent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    token?: import("mongoose").SchemaDefinitionProperty<string, Parent, import("mongoose").Document<unknown, {}, Parent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Parent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ParentStatus, Parent, import("mongoose").Document<unknown, {}, Parent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Parent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    signedOutAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Parent, import("mongoose").Document<unknown, {}, Parent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Parent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Parent>;
