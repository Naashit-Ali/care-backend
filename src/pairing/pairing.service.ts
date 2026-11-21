import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomInt } from 'node:crypto';
import { Model, Types } from 'mongoose';
import { env } from '../env.js';
import { PairingCode } from './pairing-code.schema.js';

@Injectable()
export class PairingService {
  constructor(@InjectModel(PairingCode.name) private codes: Model<PairingCode>) {}

  async create(caregiverId: string, parentId?: string) {
    const now = new Date();
    let code: string;
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

  /** Atomically marks a valid code as used. Returns null if wrong, expired or already used. */
  consume(code: string) {
    return this.codes.findOneAndUpdate(
      { code, usedAt: null, expiresAt: { $gt: new Date() } },
      { usedAt: new Date() },
      { new: true },
    );
  }
}
