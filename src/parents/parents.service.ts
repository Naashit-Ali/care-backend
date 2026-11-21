import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { isValidObjectId, Model } from 'mongoose';
import type { AuthUser } from '../common/auth.service.js';
import { PairingService } from '../pairing/pairing.service.js';
import { RealtimeGateway } from '../realtime/realtime.gateway.js';
import { Parent, ParentStatus } from './parent.schema.js';

@Injectable()
export class ParentsService {
  constructor(
    @InjectModel(Parent.name) private parents: Model<Parent>,
    private pairing: PairingService,
    private realtime: RealtimeGateway,
  ) {}

  async join(name: string, code: string) {
    const pairing = await this.pairing.consume(code);
    if (!pairing) throw new BadRequestException('Wrong or expired code');
    if (pairing.parentId) return this.reconnect(String(pairing.parentId), String(pairing.caregiverId));

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

  /** Reconnect code: sign back in as the existing parent with a fresh token (no new approval). */
  private async reconnect(parentId: string, caregiverId: string) {
    const parent = await this.parents.findOneAndUpdate(
      { _id: parentId, caregiverId, status: 'active' },
      { token: randomUUID(), $unset: { signedOutAt: 1 } },
      { new: true },
    );
    if (!parent) throw new BadRequestException('Wrong or expired code');
    this.realtime.toCaregiver(caregiverId, 'parent:reconnected', { parentId, name: parent.name });
    return { id: parentId, name: parent.name, token: parent.token, status: parent.status };
  }

  async createReconnectCode(caregiverId: string, parentId: string) {
    const parent = await this.getAccessible({ role: 'caregiver', id: caregiverId, name: '' }, parentId);
    if (parent.status !== 'active') throw new BadRequestException('Only approved parents can be reconnected');
    return this.pairing.create(caregiverId, parentId);
  }

  /**
   * Parent signs out: the old token stops working and the caregiver is told. A parent still
   * waiting for approval withdraws their join request instead.
   */
  async signOut(user: Extract<AuthUser, { role: 'parent' }>) {
    if (user.status === 'pending') {
      await this.parents.deleteOne({ _id: user.id, status: 'pending' });
      this.realtime.toCaregiver(user.caregiverId, 'parent:signed-out', {
        parentId: user.id,
        name: user.name,
        withdrawn: true,
      });
    } else {
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

  listForCaregiver(caregiverId: string) {
    return this.parents.find({ caregiverId }).select('-token').sort({ createdAt: -1 }).lean();
  }

  async setStatus(caregiverId: string, parentId: string, status: ParentStatus) {
    if (!isValidObjectId(parentId)) throw new NotFoundException('Parent not found');
    const parent = await this.parents
      .findOneAndUpdate({ _id: parentId, caregiverId }, { status }, { new: true })
      .select('-token')
      .lean();
    if (!parent) throw new NotFoundException('Parent not found');
    this.realtime.toParent(parentId, 'parent:status', { status });
    return parent;
  }

  /** Loads a parent the user may see: the owning caregiver, or the parent themself. */
  async getAccessible(user: AuthUser, parentId: string) {
    if (!isValidObjectId(parentId)) throw new NotFoundException('Parent not found');
    const parent = await this.parents.findById(parentId).select('-token').lean();
    if (!parent) throw new NotFoundException('Parent not found');
    const allowed =
      user.role === 'caregiver' ? String(parent.caregiverId) === user.id : String(parent._id) === user.id;
    if (!allowed) throw new ForbiddenException();
    return parent;
  }
}
