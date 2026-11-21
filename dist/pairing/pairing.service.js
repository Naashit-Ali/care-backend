var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomInt } from 'node:crypto';
import { Model, Types } from 'mongoose';
import { env } from '../env.js';
import { PairingCode } from './pairing-code.schema.js';
let PairingService = class PairingService {
    codes;
    constructor(codes) {
        this.codes = codes;
    }
    async create(caregiverId, parentId) {
        const now = new Date();
        let code;
        do {
            code = String(randomInt(100000, 1000000));
        } while (await this.codes.exists({ code, usedAt: null, expiresAt: { $gt: now } }));
        const expiresAt = new Date(now.getTime() + env.pairingCodeTtlMinutes * 60_000);
        await this.codes.create({
            code,
            caregiverId: new Types.ObjectId(caregiverId),
            parentId: parentId ? new Types.ObjectId(parentId) : undefined,
            expiresAt,
        });
        return { code, expiresAt };
    }
    consume(code) {
        return this.codes.findOneAndUpdate({ code, usedAt: null, expiresAt: { $gt: new Date() } }, { usedAt: new Date() }, { new: true });
    }
};
PairingService = __decorate([
    Injectable(),
    __param(0, InjectModel(PairingCode.name)),
    __metadata("design:paramtypes", [Model])
], PairingService);
export { PairingService };
//# sourceMappingURL=pairing.service.js.map