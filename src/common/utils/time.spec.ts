import { atTime, dayString, hhmm } from './time.js';

describe('time utils', () => {
  it('builds a date at HH:mm on the same local day', () => {
    const d = atTime(new Date(2026, 10, 21, 23, 59), '08:05');
    expect(dayString(d)).toBe('2026-11-21');
    expect(hhmm(d)).toBe('08:05');
  });
});
