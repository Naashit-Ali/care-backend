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
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { isValidObjectId, Model } from 'mongoose';
import { PairingService } from '../pairing/pairing.service.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { Parent } from './parent.schema.js';
let ParentsService = class ParentsService {
    parents;
    pairing;
    realtime;
    constructor(parents, pairing, realtime) {
        this.parents = parents;
        this.pairing = pairing;
        this.realtime = realtime;
    }
    async join(name, code) {
        const pairing = await this.pairing.consume(code);
        if (!pairing)
            throw new BadRequestException('Wrong or expired code');
        if (pairing.parentId)
            return this.reconnect(String(pairing.parentId), String(pairing.caregiverId));
        const parent = await this.parents.create({
            name,
            caregiverId: pairing.caregiverId,
            token: randomUUID(),
            status: 'pending',
        });
        this.realtime.toCaregiver(String(pairing.caregiverId), 'parent:join-request', {
            parentId: String(parent._id),
            name: parent.name,
        });
        return { id: String(parent._id), name: parent.name, token: parent.token, status: parent.status };
    }
    async reconnect(parentId, caregiverId) {
        const parent = await this.parents.findOneAndUpdate({ _id: parentId, caregiverId, status: 'active' }, { token: randomUUID(), $unset: { signedOutAt: 1 } }, { new: true });
        if (!parent)
            throw new BadRequestException('Wrong or expired code');
        this.realtime.toCaregiver(caregiverId, 'parent:reconnected', { parentId, name: parent.name });
        return { id: parentId, name: parent.name, token: parent.token, status: parent.status };
    }
    async createReconnectCode(caregiverId, parentId) {
        const parent = await this.getAccessible({ role: 'caregiver', id: caregiverId, name: '' }, parentId);
        if (parent.status !== 'active')
            throw new BadRequestException('Only approved parents can be reconnected');
        return this.pairing.create(caregiverId, parentId);
    }
    async signOut(user) {
        if (user.status === 'pending') {
            await this.parents.deleteOne({ _id: user.id, status: 'pending' });
            this.realtime.toCaregiver(user.caregiverId, 'parent:signed-out', {
                parentId: user.id,
                name: user.name,
                withdrawn: true,
            });
        }
        else {
            await this.parents.updateOne({ _id: user.id }, { token: randomUUID(), signedOutAt: new Date() });
            if (user.status === 'active') {
                this.realtime.toCaregiver(user.caregiverId, 'parent:signed-out', {
                    parentId: user.id,
                    name: user.name,
                    withdrawn: false,
                });
            }
        }
        this.realtime.disconnectParent(user.id);
        return { ok: true };
    }
    listForCaregiver(caregiverId) {
        return this.parents.find({ caregiverId }).select('-token').sort({ createdAt: -1 }).lean();
    }
    async setStatus(caregiverId, parentId, status) {
        if (!isValidObjectId(parentId))
            throw new NotFoundException('Parent not found');
        const parent = await this.parents
            .findOneAndUpdate({ _id: parentId, caregiverId }, { status }, { new: true })
            .select('-token')
            .lean();
        if (!parent)
            throw new NotFoundException('Parent not found');
        this.realtime.toParent(parentId, 'parent:status', { status });
        return parent;
    }
    async getAccessible(user, parentId) {
        if (!isValidObjectId(parentId))
            throw new NotFoundException('Parent not found');
        const parent = await this.parents.findById(parentId).select('-token').lean();
        if (!parent)
            throw new NotFoundException('Parent not found');
        const allowed = user.role === 'caregiver' ? String(parent.caregiverId) === user.id : String(parent._id) === user.id;
        if (!allowed)
            throw new ForbiddenException();
        return parent;
    }
};
ParentsService = __decorate([
    Injectable(),
    __param(0, InjectModel(Parent.name)),
    __metadata("design:paramtypes", [Model,
        PairingService,
        RealtimeGateway])
], ParentsService);
export { ParentsService };
//# sourceMappingURL=parents.service.js.map