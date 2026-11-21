import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { AuthUser } from './auth.service.js';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user,
);

export function requireCaregiver(user: AuthUser): asserts user is Extract<AuthUser, { role: 'caregiver' }> {
  if (user.role !== 'caregiver') throw new ForbiddenException('Caregivers only');
}

export function requireParent(user: AuthUser): asserts user is Extract<AuthUser, { role: 'parent' }> {
  if (user.role !== 'parent') throw new ForbiddenException('Parents only');
}
