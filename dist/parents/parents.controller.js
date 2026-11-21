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
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsString, Length, Matches } from 'class-validator';
import { AllowPending, AuthGuard } from '../common/auth.guard.js';
import { CurrentUser, requireCaregiver, requireParent } from '../common/current-user.decorator.js';
import { ParentsService } from './parents.service.js';
class JoinDto {
    name;
    code;
}
__decorate([
    IsString(),
    Length(1, 60),
    __metadata("design:type", String)
], JoinDto.prototype, "name", void 0);
__decorate([
    Matches(/^\d{6}$/, { message: 'Code must be 6 digits' }),
    __metadata("design:type", String)
], JoinDto.prototype, "code", void 0);
let ParentsController = class ParentsController {
    parents;
    constructor(parents) {
        this.parents = parents;
    }
    join(dto) {
        return this.parents.join(dto.name, dto.code);
    }
    me(user) {
        requireParent(user);
        return { id: user.id, name: user.name, status: user.status, caregiverId: user.caregiverId };
    }
    signOut(user) {
        requireParent(user);
        return this.parents.signOut(user);
    }
    reconnectCode(user, id) {
        requireCaregiver(user);
        return this.parents.createReconnectCode(user.id, id);
    }
    list(user) {
        requireCaregiver(user);
        return this.parents.listForCaregiver(user.id);
    }
    approve(user, id) {
        requireCaregiver(user);
        return this.parents.setStatus(user.id, id, 'active');
    }
    reject(user, id) {
        requireCaregiver(user);
        return this.parents.setStatus(user.id, id, 'rejected');
    }
};
__decorate([
    Post('join'),
    Throttle({ default: { limit: 5, ttl: 60_000 } }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [JoinDto]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "join", null);
__decorate([
    Get('me'),
    UseGuards(AuthGuard),
    AllowPending(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "me", null);
__decorate([
    Post('me/sign-out'),
    UseGuards(AuthGuard),
    AllowPending(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "signOut", null);
__decorate([
    Post(':id/reconnect-code'),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "reconnectCode", null);
__decorate([
    Get(),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "list", null);
__decorate([
    Patch(':id/approve'),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "approve", null);
__decorate([
    Patch(':id/reject'),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ParentsController.prototype, "reject", null);
ParentsController = __decorate([
    Controller('parents'),
    __metadata("design:paramtypes", [ParentsService])
], ParentsController);
export { ParentsController };
//# sourceMappingURL=parents.controller.js.map