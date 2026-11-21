import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard.js';
import type { AuthUser } from '../common/auth.service.js';
import { CurrentUser, requireCaregiver } from '../common/current-user.decorator.js';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/create-medicine.dto.js';
import { MedicinesService } from './medicines.service.js';

@Controller()
@UseGuards(AuthGuard)
export class MedicinesController {
  constructor(private medicines: MedicinesService) {}

  @Post('parents/:id/medicines')
  create(@CurrentUser() user: AuthUser, @Param('id') parentId: string, @Body() dto: CreateMedicineDto) {
    requireCaregiver(user);
    return this.medicines.create(user, parentId, dto);
  }

  @Get('parents/:id/medicines')
  list(@CurrentUser() user: AuthUser, @Param('id') parentId: string) {
    return this.medicines.list(user, parentId);
  }

  @Patch('medicines/:id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateMedicineDto) {
    requireCaregiver(user);
    return this.medicines.update(user.id, id, dto);
  }

  @Delete('medicines/:id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireCaregiver(user);
    return this.medicines.remove(user.id, id);
  }
}
