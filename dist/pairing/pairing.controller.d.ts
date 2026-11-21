import type { AuthUser } from '../common/auth.service.js';
import { PairingService } from './pairing.service.js';
export declare class PairingController {
    private pairing;
    constructor(pairing: PairingService);
    create(user: AuthUser): Promise<{
        code: string;
        expiresAt: Date;
    }>;
}
