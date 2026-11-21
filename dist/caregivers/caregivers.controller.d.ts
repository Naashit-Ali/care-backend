import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import type { AuthUser } from '../common/auth.service.js';
import { Caregiver } from './caregiver.schema.js';
declare class RegisterCaregiverDto {
    name: string;
    email: string;
    password: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class CaregiversController implements OnModuleInit {
    private caregivers;
    constructor(caregivers: Model<Caregiver>);
    onModuleInit(): Promise<void>;
    register(dto: RegisterCaregiverDto): Promise<{
        id: string;
        name: string;
        email: string;
        token: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    login(dto: LoginDto): Promise<{
        id: string;
        name: string;
        email: string;
        token: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    logout(user: AuthUser, token: string): Promise<{
        ok: boolean;
    }>;
    me(user: AuthUser): {
        id: string;
        name: string;
    };
}
export {};
