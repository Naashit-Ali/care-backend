import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type AgentLogType = 'thought' | 'tool_call' | 'result';
export type AgentLogDocument = HydratedDocument<AgentLog>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AgentLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true, index: true })
  parentId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Caregiver', required: true, index: true })
  caregiverId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Dose' })
  doseId?: Types.ObjectId;

  @Prop({ type: String, enum: ['thought', 'tool_call', 'result'], required: true })
  type: AgentLogType;

  @Prop()
  tool?: string;

  @Prop({ required: true })
  message: string;
}
export const AgentLogSchema = SchemaFactory.createForClass(AgentLog);
AgentLogSchema.index({ parentId: 1, createdAt: -1 });
