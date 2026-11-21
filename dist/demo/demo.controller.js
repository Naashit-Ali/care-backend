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
import { BadRequestException, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard.js';
import { CurrentUser, requireCaregiver } from '../common/current-user.decorator.js';
import { DosesService } from '../doses/doses.service.js';
import { MedicinesService } from '../medicines/medicines.service.js';
let DemoController = class DemoController {
    doses;
    medicines;
    constructor(doses, medicines) {
        this.doses = doses;
        this.medicines = medicines;
    }
    async miss(user, id) {
        requireCaregiver(user);
        const dose = await this.doses.findOwned(user, id);
        const missed = await this.doses.markMissed(dose);
        if (!missed)
            throw new BadRequestException('Only pending doses can be marked missed');
        return missed;
    }
    async doseSoon(user, id) {
        requireCaregiver(user);
        const med = await this.medicines.findOwned(user.id, id);
        return this.doses.createSoon(med, 1);
    }
};
__decorate([
    Post('doses/:id/miss'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DemoController.prototype, "miss", null);
__decorate([
    Post('medicines/:id/dose-in-1-min'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DemoController.prototype, "doseSoon", null);
DemoController = __decorate([
    Controller('demo'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [DosesService,
        MedicinesService])
], DemoController);
export { DemoController };
//# sourceMappingURL=demo.controller.js.map