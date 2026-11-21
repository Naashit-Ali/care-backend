import type { AuthUser } from './auth.service.js';
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare function requireCaregiver(user: AuthUser): asserts user is Extract<AuthUser, {
    role: 'caregiver';
}>;
export declare function requireParent(user: AuthUser): asserts user is Extract<AuthUser, {
    role: 'parent';
}>;
