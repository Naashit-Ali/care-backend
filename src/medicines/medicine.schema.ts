import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type MedicineDocument = HydratedDocument<Medicine> & { createdAt: Date };

/** Doses are only generated for times after this moment on its day (set on create and on schedule edits). */
export const scheduleStart = (med: MedicineDocument) => med.scheduleFrom ?? med.createdAt;

@Schema({ timestamps: true })
export class Medicine {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true, index: true }) parentId: Types.ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true }) caregiverId: Types.ObjectId;
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, trim: true }) dose: string;
  @Prop({ type: [String], required: true }) times: string[];
  @Prop({ default: false }) critical: boolean;
  @Prop({ default: true }) active: boolean;
  @Prop() scheduleFrom?: Date;
}
export const MedicineSchema = SchemaFactory.createForClass(Medicine);
