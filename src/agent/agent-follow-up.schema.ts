import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type AgentFollowUpDocument = HydratedDocument<AgentFollowUp>;

@Schema({ timestamps: true })
export class AgentFollowUp {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Dose', required: true, index: true })
  doseId: Types.ObjectId;

  @Prop({ required: true, index: true })
  runAt: Date;

  @Prop({ default: false, index: true })
  done: boolean;
}
export const AgentFollowUpSchema = SchemaFactory.createForClass(AgentFollowUp);
