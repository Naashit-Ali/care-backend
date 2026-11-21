import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ParentStatus = 'pending' | 'active' | 'rejected';
export type ParentDocument = HydratedDocument<Parent>;

@Schema({ timestamps: true })
export class Parent {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true, index: true })
  caregiverId: Types.ObjectId;
  @Prop({ required: true, unique: true, index: true }) token: string;
  @Prop({ type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' })
  status: ParentStatus;
  /** Set when the parent signs out on their phone; cleared when they reconnect. */
  @Prop() signedOutAt?: Date;
}
export const ParentSchema = SchemaFactory.createForClass(Parent);
