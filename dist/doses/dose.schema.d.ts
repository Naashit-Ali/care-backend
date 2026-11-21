import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
export type DoseStatus = 'pending' | 'taken' | 'missed';
export type DoseDocument = HydratedDocument<Dose>;
export declare class Dose {
    medicineId: Types.ObjectId;
    parentId: Types.ObjectId;
    caregiverId: Types.ObjectId;
    medicineName: string;
    dose: string;
    critical: boolean;
    date: string;
    scheduledAt: Date;
    status: DoseStatus;
    takenAt?: Date;
    missedAt?: Date;
}
export declare const DoseSchema: MongooseSchema<Dose, import("mongoose").Model<Dose, any, any, any, any, any, Dose & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Dose, import("mongoose").Document<unknown, {}, Dose, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    medicineId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    parentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    caregiverId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    medicineName?: import("mongoose").SchemaDefinitionProperty<string, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    dose?: import("mongoose").SchemaDefinitionProperty<string, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    critical?: import("mongoose").SchemaDefinitionProperty<boolean, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<string, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    scheduledAt?: import("mongoose").SchemaDefinitionProperty<Date, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<DoseStatus, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    takenAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    missedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Dose, import("mongoose").Document<unknown, {}, Dose, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dose & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Dose>;
