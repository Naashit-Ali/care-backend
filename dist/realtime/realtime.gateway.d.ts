import { OnGatewayConnection } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { AuthService } from '../common/auth.service.js';
export declare class RealtimeGateway implements OnGatewayConnection {
    private auth;
    server: Server;
    constructor(auth: AuthService);
    handleConnection(client: Socket): Promise<void>;
    toCaregiver(id: string, event: string, data: unknown): void;
    toParent(id: string, event: string, data: unknown): void;
    disconnectParent(id: string): void;
}
