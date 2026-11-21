import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AgentModule } from './agent/agent.module.js';
import { CaregiversModule } from './caregivers/caregivers.module.js';
import { AuthModule } from './common/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { DemoModule } from './demo/demo.module.js';
import { DosesModule } from './doses/doses.module.js';
import { env } from './env.js';
import { MedicinesModule } from './medicines/medicines.module.js';
import { PairingModule } from './pairing/pairing.module.js';
import { ParentsModule } from './parents/parents.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(env.mongoUri),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    DatabaseModule,
    AuthModule,
    RealtimeModule,
    CaregiversModule,
    PairingModule,
    ParentsModule,
    MedicinesModule,
    DosesModule,
    AgentModule,
    DemoModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
