import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsString, Length, Matches } from 'class-validator';
import { AllowPending, AuthGuard } from '../common/auth.guard.js';
import type { AuthUser } from '../common/auth.service.js';
import { CurrentUser, requireCaregiver, requireParent } from '../common/current-user.decorator.js';
import { ParentsService } from './parents.service.js';

class JoinDto {
  @IsString() @Length(1, 60) name: string;
  @Matches(/^\d{6}$/, { message: 'Code must be 6 digits' }) code: string;
}

@Controller('parents')
export class ParentsController {
  constructor(private parents: ParentsService) {}

  @Post('join')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  join(@Body() dto: JoinDto) {
    return this.parents.join(dto.name, dto.code);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @AllowPending()
  me(@CurrentUser() user: AuthUser) {
    requireParent(user);
    return { id: user.id, name: user.name, status: user.status, caregiverId: user.caregiverId };
  }

  @Post('me/sign-out')
  @UseGuards(AuthGuard)
  @AllowPending()
  signOut(@CurrentUser() user: AuthUser) {
    requireParent(user);
    return this.parents.signOut(user);
  }

  @Post(':id/reconnect-code')
  @UseGuards(AuthGuard)
  reconnectCode(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireCaregiver(user);
    return this.parents.createReconnectCode(user.id, id);
  }

  @Get()
  @UseGuards(AuthGuard)
  list(@CurrentUser() user: AuthUser) {
    requireCaregiver(user);
    return this.parents.listForCaregiver(user.id);
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard)
  approve(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireCaregiver(user);
    return this.parents.setStatus(user.id, id, 'active');
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard)
  reject(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    requireCaregiver(user);
    return this.parents.setStatus(user.id, id, 'rejected');
  }
}
