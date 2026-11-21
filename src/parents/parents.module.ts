import { Module } from '@nestjs/common';
import { PairingModule } from '../pairing/pairing.module.js';
import { ParentsController } from './parents.controller.js';
import { ParentsService } from './parents.service.js';

@Module({
  imports: [PairingModule],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService],
})
export class ParentsModule {}
