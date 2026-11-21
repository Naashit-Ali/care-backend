import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service.js';
export declare const AllowPending: () => import("@nestjs/common").CustomDecorator<string>;
export declare class AuthGuard implements CanActivate {
    private auth;
    private reflector;
    constructor(auth: AuthService, reflector: Reflector);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
