import {
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  HttpCode,
  OnModuleInit,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsString, Length } from 'class-validator';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import { AuthGuard } from '../common/auth.guard.js';
import type { AuthUser } from '../common/auth.service.js';
import { CurrentUser, requireCaregiver } from '../common/current-user.decorator.js';
import { hashPassword, verifyPassword } from '../common/password.js';
import { Caregiver } from './caregiver.schema.js';

class RegisterCaregiverDto {
  @IsString() @Length(1, 60) name: string;
  @IsEmail({}, { message: 'Enter a valid email' }) email: string;
  @IsString() @Length(6, 100, { message: 'Password must be at least 6 characters' }) password: string;
}

class LoginDto {
  @IsEmail({}, { message: 'Enter a valid email' }) email: string;
  @IsString() @Length(1, 100) password: string;
}

@Controller('caregivers')
export class CaregiversController implements OnModuleInit {
  constructor(@InjectModel(Caregiver.name) private caregivers: Model<Caregiver>) {}

  /** Drops indexes from older schema versions (e.g. the old unique `token`), then builds current ones. */
  async onModuleInit() {
    await this.caregivers.syncIndexes();
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async register(@Body() dto: RegisterCaregiverDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.caregivers.exists({ email })) {
      throw new ConflictException('An account with this email already exists. Log in instead.');
    }
    const token = randomUUID();
    const c = await this.caregivers.create({
      name: dto.name,
      email,
      passwordHash: await hashPassword(dto.password),
      tokens: [token],
    });
    return { id: String(c._id), name: c.name, email, token };
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async login(@Body() dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const c = await this.caregivers.findOne({ email }).select('+passwordHash');
    if (!c || !(await verifyPassword(dto.password, c.passwordHash))) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const token = randomUUID();
    await this.caregivers.updateOne({ _id: c._id }, { $push: { tokens: token } });
    return { id: String(c._id), name: c.name, email, token };
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async logout(@CurrentUser() user: AuthUser, @Headers('x-auth-token') token: string) {
    requireCaregiver(user);
    await this.caregivers.updateOne({ _id: user.id }, { $pull: { tokens: token } });
    return { ok: true };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AuthUser) {
    requireCaregiver(user);
    return { id: user.id, name: user.name };
  }
}
