var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CaregiversModule } from './caregivers/caregivers.module.js';
import { AuthModule } from './common/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { DosesModule } from './doses/doses.module.js';
import { env } from './env.js';
import { MedicinesModule } from './medicines/medicines.module.js';
import { PairingModule } from './pairing/pairing.module.js';
import { ParentsModule } from './parents/parents.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
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
        ],
        controllers: [AppController],
        providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map