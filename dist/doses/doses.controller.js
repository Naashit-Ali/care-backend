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
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard.js';
import { CurrentUser, requireParent } from '../common/current-user.decorator.js';
import { ParentsService } from '../parents/parents.service.js';
import { DosesService } from './doses.service.js';
let DosesController = class DosesController {
    doses;
    parents;
    constructor(doses, parents) {
        this.doses = doses;
        this.parents = parents;
    }
    async today(user, parentId) {
        await this.parents.getAccessible(user, parentId);
        return this.doses.today(parentId);
    }
    take(user, id) {
        requireParent(user);
        return this.doses.take(user, id);
    }
};
__decorate([
    Get('parents/:id/doses/today'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DosesController.prototype, "today", null);
__decorate([
    Post('doses/:id/take'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DosesController.prototype, "take", null);
DosesController = __decorate([
    Controller(),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [DosesService,
        ParentsService])
], DosesController);
export { DosesController };
//# sourceMappingURL=doses.controller.js.map