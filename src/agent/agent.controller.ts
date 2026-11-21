import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard.js';
import type { AuthUser } from '../common/auth.service.js';
import { CurrentUser, requireCaregiver } from '../common/current-user.decorator.js';
import { DosesService } from '../doses/doses.service.js';
import { ParentsService } from '../parents/parents.service.js';
import { AgentService } from './agent.service.js';

@Controller()
@UseGuards(AuthGuard)
export class AgentController {
  constructor(
    private agent: AgentService,
    private parents: ParentsService,
    private doses: DosesService,
  ) {}

  @Get('parents/:id/agent-logs')
  async list(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireCaregiver(user);
    await this.parents.getAccessible(user, id);
    return this.agent.listForParent(id);
  }

  /** Demo: re-run the agent for a missed dose without waiting for the follow-up cron. */
  @Post('demo/doses/:id/run-agent')
  async runNow(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireCaregiver(user);
    const dose = await this.doses.findOwned(user, id);
    if (dose.status !== 'missed') {
      return { ok: false, message: 'Dose must be missed first' };
    }
    await this.agent.onDoseMissed(dose.toObject() as Parameters<AgentService['onDoseMissed']>[0]);
    return { ok: true };
  }
}
