import { createParamDecorator, ForbiddenException } from '@nestjs/common';
export const CurrentUser = createParamDecorator((_, ctx) => ctx.switchToHttp().getRequest().user);
export function requireCaregiver(user) {
    if (user.role !== 'caregiver')
        throw new ForbiddenException('Caregivers only');
}
export function requireParent(user) {
    if (user.role !== 'parent')
        throw new ForbiddenException('Parents only');
}
//# sourceMappingURL=current-user.decorator.js.map