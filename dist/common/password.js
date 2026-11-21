import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);
const KEY_LEN = 64;
export async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const hash = await scryptAsync(password, salt, KEY_LEN);
    return `${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
    const [salt, hashHex] = stored?.split(':') ?? [];
    if (!salt || !hashHex)
        return false;
    const expected = Buffer.from(hashHex, 'hex');
    const actual = await scryptAsync(password, salt, expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
}
//# sourceMappingURL=password.js.map