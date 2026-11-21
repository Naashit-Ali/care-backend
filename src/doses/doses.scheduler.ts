import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DosesService } from './doses.service.js';

@Injectable()
export class DosesScheduler implements OnModuleInit {
  private readonly logger = new Logger(DosesScheduler.name);
  private checking = false;

  constructor(private doses: DosesService) {}

  async onModuleInit() {
    await this.doses.generateToday();
  }

  @Cron('1 0 * * *', { timeZone: process.env.TZ })
  async generateToday() {
    await this.doses.generateToday();
    this.logger.log("Generated today's doses");
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkMissed() {
    if (this.checking) return;
    this.checking = true;
    try {
      await this.doses.markOverdueMissed();
    } finally {
      this.checking = false;
    }
  }
}
