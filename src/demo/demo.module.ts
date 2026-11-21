import { Module } from '@nestjs/common';
import { DosesModule } from '../doses/doses.module.js';
import { MedicinesModule } from '../medicines/medicines.module.js';
import { DemoController } from './demo.controller.js';

@Module({ imports: [DosesModule, MedicinesModule], controllers: [DemoController] })
export class DemoModule {}
