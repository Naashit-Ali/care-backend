import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type PairingCodeDocument = HydratedDocument<PairingCode>;

@Schema({ timestamps: true })
export class PairingCode {
  @Prop({ required: true, index: true }) code: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true }) caregiverId: Types.ObjectId;
  /** Set for reconnect codes: joining with it signs back in as this existing parent. */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent' }) parentId?: Types.ObjectId;
  @Prop({ required: true }) expiresAt: Date;
  @Prop() usedAt?: Date;
}
export const PairingCodeSchema = SchemaFactory.createForClass(PairingCode);
