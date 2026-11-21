import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Caregiver } from '../caregivers/caregiver.schema.js';
import { Parent, ParentStatus } from '../parents/parent.schema.js';

export type AuthUser =
  | { role: 'caregiver'; id: string; name: string }
  | { role: 'parent'; id: string; name: string; status: ParentStatus; caregiverId: string };

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Caregiver.name) private caregivers: Model<Caregiver>,
    @InjectModel(Parent.name) private parents: Model<Parent>,
  ) {}

  async findByToken(token: unknown): Promise<AuthUser | null> {
    if (typeof token !== 'string' || !token) return null;
    const caregiver = await this.caregivers.findOne({ tokens: token }).lean();
    if (caregiver) return { role: 'caregiver', id: String(caregiver._id), name: caregiver.name };
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
}
