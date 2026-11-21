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
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard.js';
import { CurrentUser, requireCaregiver } from '../common/current-user.decorator.js';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/create-medicine.dto.js';
import { MedicinesService } from './medicines.service.js';
let MedicinesController = class MedicinesController {
    medicines;
    constructor(medicines) {
        this.medicines = medicines;
    }
    create(user, parentId, dto) {
        requireCaregiver(user);
        return this.medicines.create(user, parentId, dto);
    }
    list(user, parentId) {
        return this.medicines.list(user, parentId);
    }
    update(user, id, dto) {
        requireCaregiver(user);
        return this.medicines.update(user.id, id, dto);
    }
    remove(user, id) {
        requireCaregiver(user);
        return this.medicines.remove(user.id, id);
    }
};
__decorate([
    Post('parents/:id/medicines'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateMedicineDto]),
    __metadata("design:returntype", void 0)
], MedicinesController.prototype, "create", null);
__decorate([
    Get('parents/:id/medicines'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MedicinesController.prototype, "list", null);
__decorate([
    Patch('medicines/:id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateMedicineDto]),
    __metadata("design:returntype", void 0)
], MedicinesController.prototype, "update", null);
__decorate([
    Delete('medicines/:id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MedicinesController.prototype, "remove", null);
MedicinesController = __decorate([
    Controller(),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [MedicinesService])
], MedicinesController);
export { MedicinesController };
//# sourceMappingURL=medicines.controller.js.map