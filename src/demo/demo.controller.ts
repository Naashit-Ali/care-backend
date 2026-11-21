import { BadRequestException, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard.js';
import type { AuthUser } from '../common/auth.service.js';
import { CurrentUser, requireCaregiver } from '../common/current-user.decorator.js';
import { DosesService } from '../doses/doses.service.js';
import { MedicinesService } from '../medicines/medicines.service.js';

@Controller('demo')
@UseGuards(AuthGuard)
export class DemoController {
  constructor(
    private doses: DosesService,
    private medicines: MedicinesService,
  ) {}

  @Post('doses/:id/miss')
  async miss(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireCaregiver(user);
    const dose = await this.doses.findOwned(user, id);
    const missed = await this.doses.markMissed(dose);
    if (!missed) throw new BadRequestException('Only pending doses can be marked missed');
    return missed;
  }

  @Post('medicines/:id/dose-in-1-min')
  async doseSoon(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireCaregiver(user);
    const med = await this.medicines.findOwned(user.id, id);
    return this.doses.createSoon(med, 1);
  }
}
