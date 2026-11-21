import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type DoseStatus = 'pending' | 'taken' | 'missed';
export type DoseDocument = HydratedDocument<Dose>;

@Schema({ timestamps: true })
export class Dose {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Medicine', required: true }) medicineId: Types.ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true, index: true }) parentId: Types.ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true, index: true }) caregiverId: Types.ObjectId;
  @Prop({ required: true }) medicineName: string;
  @Prop({ required: true }) dose: string;
  @Prop({ default: false }) critical: boolean;
  @Prop({ required: true }) date: string;
  @Prop({ required: true }) scheduledAt: Date;
  @Prop({ type: String, enum: ['pending', 'taken', 'missed'], default: 'pending' }) status: DoseStatus;
  @Prop() takenAt?: Date;
  @Prop() missedAt?: Date;
}
export const DoseSchema = SchemaFactory.createForClass(Dose);
DoseSchema.index({ medicineId: 1, scheduledAt: 1 }, { unique: true });
DoseSchema.index({ status: 1, scheduledAt: 1 });
