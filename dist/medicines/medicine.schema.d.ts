import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type MedicineDocument = HydratedDocument<Medicine> & {
    createdAt: Date;
};
export declare const scheduleStart: (med: MedicineDocument) => Date;
export declare class Medicine {
    parentId: Types.ObjectId;
    caregiverId: Types.ObjectId;
    name: string;
    dose: string;
    times: string[];
    critical: boolean;
    active: boolean;
    scheduleFrom?: Date;
}
export declare const MedicineSchema: MongooseSchema<Medicine, import("mongoose").Model<Medicine, any, any, any, any, any, Medicine & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Medicine, import("mongoose").Document<unknown, {}, Medicine, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    parentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Medicine, import("mongoose").Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    caregiverId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Medicine, import("mongoose").Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Medicine, import("mongoose").Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    dose?: import("mongoose").SchemaDefinitionProperty<string, Medicine, import("mongoose").Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    times?: import("mongoose").SchemaDefinitionProperty<string[], Medicine, import("mongoose").Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    critical?: import("mongoose").SchemaDefinitionProperty<boolean, Medicine, import("mongoose").Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    active?: import("mongoose").SchemaDefinitionProperty<boolean, Medicine, import("mongoose").Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    scheduleFrom?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Medicine, import("mongoose").Document<unknown, {}, Medicine, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Medicine & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Medicine>;
