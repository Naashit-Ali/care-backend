var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, SetMetadata, UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service.js';
const ALLOW_PENDING = 'allowPending';
export const AllowPending = () => SetMetadata(ALLOW_PENDING, true);
let AuthGuard = class AuthGuard {
    auth;
    reflector;
    constructor(auth, reflector) {
        this.auth = auth;
        this.reflector = reflector;
    }
    async canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        const user = await this.auth.findByToken(req.headers['x-auth-token']);
        if (!user)
            throw new UnauthorizedException('Invalid token');
        const allowPending = this.reflector.getAllAndOverride(ALLOW_PENDING, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (user.role === 'parent' && user.status !== 'active' && !allowPending) {
            throw new ForbiddenException('Waiting for caregiver approval');
        }
        req.user = user;
        return true;
    }
};
AuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthService,
        Reflector])
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map