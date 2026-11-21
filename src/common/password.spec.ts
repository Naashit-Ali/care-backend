import { hashPassword, verifyPassword } from './password.js';

describe('password hashing', () => {
  it('verifies the right password and rejects others', async () => {
    const stored = await hashPassword('secret123');
    expect(stored).not.toContain('secret123');
    expect(await verifyPassword('secret123', stored)).toBe(true);
    expect(await verifyPassword('wrong', stored)).toBe(false);
    expect(await verifyPassword('secret123', undefined)).toBe(false);
  });
});
