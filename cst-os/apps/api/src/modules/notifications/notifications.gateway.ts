import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: ['http://localhost:3002', 'http://localhost:3000'], credentials: true },
  namespace: '/feed',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /** Call this from NotificationsService after creating a feed event */
  broadcastFeedEvent(event: any) {
    this.server.emit('feed_event', event);
  }

  /** Emit to a specific user's room */
  emitToUser(userId: string, eventName: string, data: any) {
    this.server.to(`user:${userId}`).emit(eventName, data);
  }
}
