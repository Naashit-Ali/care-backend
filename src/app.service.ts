import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return { ok: true, name: 'medicare', time: new Date().toISOString() };
  }
}
