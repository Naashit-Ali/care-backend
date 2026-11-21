var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DosesScheduler_1;
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DosesService } from './doses.service.js';
let DosesScheduler = DosesScheduler_1 = class DosesScheduler {
    doses;
    logger = new Logger(DosesScheduler_1.name);
    checking = false;
    constructor(doses) {
        this.doses = doses;
    }
    async onModuleInit() {
        await this.doses.generateToday();
    }
    async generateToday() {
        await this.doses.generateToday();
        this.logger.log("Generated today's doses");
    }
    async checkMissed() {
        if (this.checking)
            return;
        this.checking = true;
        try {
            await this.doses.markOverdueMissed();
        }
        finally {
            this.checking = false;
        }
    }
};
__decorate([
    Cron('1 0 * * *', { timeZone: process.env.TZ }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DosesScheduler.prototype, "generateToday", null);
__decorate([
    Cron(CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DosesScheduler.prototype, "checkMissed", null);
DosesScheduler = DosesScheduler_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DosesService])
], DosesScheduler);
export { DosesScheduler };
//# sourceMappingURL=doses.scheduler.js.map