import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ChatService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async createConversation(title: string): Promise<Conversation> {
    const conv = new this.conversationModel({ title, messages: [] });
    return conv.save();
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.conversationModel.findById(id).exec();
  }

  async handleUserMessage(id: string, text: string): Promise<string> {
    const conv = await this.conversationModel.findById(id);
    if (!conv) throw new Error('Conversation not found');

    conv.messages.push({ role: 'user', text });

    // Tipagem manual para OpenAI
    const openAIMessages: { role: 'user' | 'assistant'; content: string }[] = conv.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.text,
    }));

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openAIMessages,
    });

    const reply = response.choices[0].message?.content || '';

    conv.messages.push({ role: 'assistant', text: reply });
    await conv.save();

    return reply;
  }
}
