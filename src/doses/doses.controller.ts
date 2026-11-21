import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard.js';
import type { AuthUser } from '../common/auth.service.js';
import { CurrentUser, requireParent } from '../common/current-user.decorator.js';
import { ParentsService } from '../parents/parents.service.js';
import { DosesService } from './doses.service.js';

@Controller()
@UseGuards(AuthGuard)
export class DosesController {
  constructor(
    private doses: DosesService,
    private parents: ParentsService,
  ) {}

  @Get('parents/:id/doses/today')
  async today(@CurrentUser() user: AuthUser, @Param('id') parentId: string) {
    await this.parents.getAccessible(user, parentId);
    return this.doses.today(parentId);
  }

  @Post('doses/:id/take')
  take(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireParent(user);
    return this.doses.take(user, id);
  }
}
