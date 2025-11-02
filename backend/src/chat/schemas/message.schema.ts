import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false }) // porque é subdocumento
export class Message {
  @Prop({ required: true })
  role!: string;

  @Prop({ required: true })
  text!: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
