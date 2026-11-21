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
import { Model } from 'mongoose';
import { Caregiver } from '../caregivers/caregiver.schema.js';
import { Parent } from '../parents/parent.schema.js';
let AuthService = class AuthService {
    caregivers;
    parents;
    constructor(caregivers, parents) {
        this.caregivers = caregivers;
        this.parents = parents;
    }
    async findByToken(token) {
        if (typeof token !== 'string' || !token)
            return null;
        const caregiver = await this.caregivers.findOne({ tokens: token }).lean();
        if (caregiver)
            return { role: 'caregiver', id: String(caregiver._id), name: caregiver.name };
        const parent = await this.parents.findOne({ token }).lean();
        if (parent) {
            return {
                role: 'parent',
                id: String(parent._id),
                name: parent.name,
                status: parent.status,
                caregiverId: String(parent.caregiverId),
            };
        }
        return null;
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, InjectModel(Caregiver.name)),
    __param(1, InjectModel(Parent.name)),
    __metadata("design:paramtypes", [Model,
        Model])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map