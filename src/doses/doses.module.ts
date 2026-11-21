import { Module, forwardRef } from '@nestjs/common';
import { AgentModule } from '../agent/agent.module.js';
import { ParentsModule } from '../parents/parents.module.js';
import { DosesController } from './doses.controller.js';
import { DosesScheduler } from './doses.scheduler.js';
import { DosesService } from './doses.service.js';

@Module({
  imports: [ParentsModule, forwardRef(() => AgentModule)],
  controllers: [DosesController],
  providers: [DosesService, DosesScheduler],
  exports: [DosesService],
})
export class DosesModule {}

