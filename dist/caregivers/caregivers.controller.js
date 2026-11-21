var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, ConflictException, Controller, Get, Headers, HttpCode, Post, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsString, Length } from 'class-validator';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import { AuthGuard } from '../common/auth.guard.js';
import { CurrentUser, requireCaregiver } from '../common/current-user.decorator.js';
import { hashPassword, verifyPassword } from '../common/password.js';
import { Caregiver } from './caregiver.schema.js';
class RegisterCaregiverDto {
    name;
    email;
    password;
}
__decorate([
    IsString(),
    Length(1, 60),
    __metadata("design:type", String)
], RegisterCaregiverDto.prototype, "name", void 0);
__decorate([
    IsEmail({}, { message: 'Enter a valid email' }),
    __metadata("design:type", String)
], RegisterCaregiverDto.prototype, "email", void 0);
__decorate([
    IsString(),
    Length(6, 100, { message: 'Password must be at least 6 characters' }),
    __metadata("design:type", String)
], RegisterCaregiverDto.prototype, "password", void 0);
class LoginDto {
    email;
    password;
}
__decorate([
    IsEmail({}, { message: 'Enter a valid email' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    IsString(),
    Length(1, 100),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let CaregiversController = class CaregiversController {
    caregivers;
    constructor(caregivers) {
        this.caregivers = caregivers;
    }
    async onModuleInit() {
        await this.caregivers.syncIndexes();
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        if (await this.caregivers.exists({ email })) {
            throw new ConflictException('An account with this email already exists. Log in instead.');
        }
        const token = randomUUID();
        const c = await this.caregivers.create({
            name: dto.name,
            email,
            passwordHash: await hashPassword(dto.password),
            tokens: [token],
        });
        return { id: String(c._id), name: c.name, email, token };
    }
    async login(dto) {
        const email = dto.email.trim().toLowerCase();
        const c = await this.caregivers.findOne({ email }).select('+passwordHash');
        if (!c || !(await verifyPassword(dto.password, c.passwordHash))) {
            throw new UnauthorizedException('Wrong email or password');
        }
        const token = randomUUID();
        await this.caregivers.updateOne({ _id: c._id }, { $push: { tokens: token } });
        return { id: String(c._id), name: c.name, email, token };
    }
    async logout(user, token) {
        requireCaregiver(user);
        await this.caregivers.updateOne({ _id: user.id }, { $pull: { tokens: token } });
        return { ok: true };
    }
    me(user) {
        requireCaregiver(user);
        return { id: user.id, name: user.name };
    }
};
__decorate([
    Post(),
    Throttle({ default: { limit: 10, ttl: 60_000 } }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterCaregiverDto]),
    __metadata("design:returntype", Promise)
], CaregiversController.prototype, "register", null);
__decorate([
    Post('login'),
    HttpCode(200),
    Throttle({ default: { limit: 10, ttl: 60_000 } }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], CaregiversController.prototype, "login", null);
__decorate([
    Post('logout'),
    HttpCode(200),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __param(1, Headers('x-auth-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CaregiversController.prototype, "logout", null);
__decorate([
    Get('me'),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CaregiversController.prototype, "me", null);
CaregiversController = __decorate([
    Controller('caregivers'),
    __param(0, InjectModel(Caregiver.name)),
    __metadata("design:paramtypes", [Model])
], CaregiversController);
export { CaregiversController };
//# sourceMappingURL=caregivers.controller.js.map