import { Module } from '@nestjs/common';
import { CaregiversController } from './caregivers.controller.js';

@Module({ controllers: [CaregiversController] })
export class CaregiversModule {}
