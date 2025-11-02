import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('join')
  handleJoin(client: Socket, convId: string) {
    client.join(convId);
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { convId: string; text: string }) {
    // broadcast user message
    this.server.to(payload.convId).emit('message', { role: 'user', text: payload.text });

    // process
    const reply = await this.chatService.handleUserMessage(payload.convId, payload.text);

    // emit assistant reply
    this.server.to(payload.convId).emit('message', { role: 'assistant', text: reply });
  }
}
