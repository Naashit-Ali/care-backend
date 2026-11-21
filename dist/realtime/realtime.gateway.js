var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { env } from '../env.js';
import { AuthService } from '../common/auth.service.js';
let RealtimeGateway = class RealtimeGateway {
    auth;
    server;
    constructor(auth) {
        this.auth = auth;
    }
    async handleConnection(client) {
        const user = await this.auth.findByToken(client.handshake.auth?.token);
        if (!user) {
            client.disconnect();
            return;
        }
        await client.join(`${user.role}:${user.id}`);
    }
    toCaregiver(id, event, data) {
        this.server.to(`caregiver:${id}`).emit(event, data);
    }
    toParent(id, event, data) {
        this.server.to(`parent:${id}`).emit(event, data);
    }
    disconnectParent(id) {
        this.server.in(`parent:${id}`).disconnectSockets(true);
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Function)
], RealtimeGateway.prototype, "server", void 0);
RealtimeGateway = __decorate([
    WebSocketGateway({ cors: { origin: env.corsOrigin() } }),
    __metadata("design:paramtypes", [AuthService])
], RealtimeGateway);
export { RealtimeGateway };
//# sourceMappingURL=realtime.gateway.js.map