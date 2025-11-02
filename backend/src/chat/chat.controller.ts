import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Conversation } from './schemas/conversation.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversation')
  async createConversation(@Body('title') title: string): Promise<Conversation> {
    return this.chatService.createConversation(title);
  }

  @Post('conversation/:id/message')
  async sendMessage(
    @Param('id') id: string,
    @Body('text') text: string
  ): Promise<{ reply: string }> {
    const reply = await this.chatService.handleUserMessage(id, text);
    return { reply };
  }

  @Get('conversation/:id')
  async getConversation(@Param('id') id: string): Promise<Conversation | null> {
    return this.chatService.getConversation(id);
  }
}
