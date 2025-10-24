import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ItemsService } from '../items/items.service';
import { JwtWsGuard } from '../auth/jwt-ws.guard';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || true, credentials: true },
})
export class EventsGateway {
  @WebSocketServer() server!: Server;
  constructor(private items: ItemsService) {}

  @UseGuards(JwtWsGuard)
  handleConnection(client: Socket) {
    // Optionally emit initial state, rooms, etc.
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('item.move')
  async onItemMove(@MessageBody() payload: { id: string; x: number; y: number }, @ConnectedSocket() client: Socket) {
    console.log('onItemMove payload:', payload);
    const updated = await this.items.updateCoords(payload.id, payload.x, payload.y);
    client.broadcast.emit('item.updated', updated);
    client.emit('item.updated', updated);
    return updated;
  }
}
