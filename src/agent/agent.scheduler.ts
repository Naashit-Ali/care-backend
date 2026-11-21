import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AgentService } from './agent.service.js';

@Injectable()
export class AgentScheduler {
  private readonly logger = new Logger(AgentScheduler.name);
  private running = false;

  constructor(private agent: AgentService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async followUps() {
    if (this.running) return;
    this.running = true;
    try {
      await this.agent.processFollowUps();
    } catch (e) {
      this.logger.error('Follow-up cron failed', e instanceof Error ? e.stack : e);
    } finally {
      this.running = false;
    }
  }
}
