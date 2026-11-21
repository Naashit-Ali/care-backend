import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CaregiverDocument = HydratedDocument<Caregiver>;

@Schema({ timestamps: true })
export class Caregiver {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ trim: true, lowercase: true }) email?: string;
  @Prop({ select: false }) passwordHash?: string;
  /** One token per signed-in device; logout removes only that device's token. */
  @Prop({ type: [String], default: [], select: false }) tokens: string[];
}
export const CaregiverSchema = SchemaFactory.createForClass(Caregiver);
// sparse: accounts created before email/password existed have no email
CaregiverSchema.index({ email: 1 }, { unique: true, sparse: true });
CaregiverSchema.index({ tokens: 1 });
