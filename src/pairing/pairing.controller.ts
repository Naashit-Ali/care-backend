import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard.js';
import type { AuthUser } from '../common/auth.service.js';
import { CurrentUser, requireCaregiver } from '../common/current-user.decorator.js';
import { PairingService } from './pairing.service.js';

@Controller('pairing')
@UseGuards(AuthGuard)
export class PairingController {
  constructor(private pairing: PairingService) {}

  @Post('codes')
  create(@CurrentUser() user: AuthUser) {
    requireCaregiver(user);
    return this.pairing.create(user.id);
  }
}
