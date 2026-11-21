import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service.js';

const ALLOW_PENDING = 'allowPending';
/** Lets parents that are not yet approved call this route. */
export const AllowPending = () => SetMetadata(ALLOW_PENDING, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = await this.auth.findByToken(req.headers['x-auth-token']);
    if (!user) throw new UnauthorizedException('Invalid token');

    const allowPending = this.reflector.getAllAndOverride<boolean>(ALLOW_PENDING, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (user.role === 'parent' && user.status !== 'active' && !allowPending) {
      throw new ForbiddenException('Waiting for caregiver approval');
    }
    req.user = user;
    return true;
  }
}
