import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { env } from '../env.js';
import { AuthService } from '../common/auth.service.js';

@WebSocketGateway({ cors: { origin: env.corsOrigin() } })
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private auth: AuthService) {}

  async handleConnection(client: Socket) {
    const user = await this.auth.findByToken(client.handshake.auth?.token);
    if (!user) {
      client.disconnect();
      return;
    }
    await client.join(`${user.role}:${user.id}`);
  }

  toCaregiver(id: string, event: string, data: unknown) {
    this.server.to(`caregiver:${id}`).emit(event, data);
  }

  toParent(id: string, event: string, data: unknown) {
    this.server.to(`parent:${id}`).emit(event, data);
  }

  disconnectParent(id: string) {
    this.server.in(`parent:${id}`).disconnectSockets(true);
  }
}
