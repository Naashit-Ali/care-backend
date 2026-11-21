import { Module } from '@nestjs/common';
import { DosesModule } from '../doses/doses.module.js';
import { ParentsModule } from '../parents/parents.module.js';
import { MedicinesController } from './medicines.controller.js';
import { MedicinesService } from './medicines.service.js';

@Module({
  imports: [ParentsModule, DosesModule],
  controllers: [MedicinesController],
  providers: [MedicinesService],
  exports: [MedicinesService],
})
export class MedicinesModule {}
