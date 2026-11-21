import { Module, forwardRef } from '@nestjs/common';
import { DosesModule } from '../doses/doses.module.js';
import { ParentsModule } from '../parents/parents.module.js';
import { AgentController } from './agent.controller.js';
import { AgentScheduler } from './agent.scheduler.js';
import { AgentService } from './agent.service.js';

@Module({
  imports: [ParentsModule, forwardRef(() => DosesModule)],
  controllers: [AgentController],
  providers: [AgentService, AgentScheduler],
  exports: [AgentService],
})
export class AgentModule {}
