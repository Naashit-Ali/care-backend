// Imported first in main.ts: decorators (e.g. the socket gateway CORS config) read process.env at import time.
try {
  process.loadEnvFile();
} catch {
  // no .env file: rely on the real environment
}
process.env.TZ ||= 'Europe/Budapest';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? '0.0.0.0',
  publicUrl: process.env.PUBLIC_URL ?? '',
  mongoUri: process.env.MONGO_URI ?? '',
  trustProxy: process.env.TRUST_PROXY === 'true',
  missedGraceMinutes: Number(process.env.MISSED_GRACE_MINUTES ?? 15),
  /** Minutes before `scheduledAt` when a pending dose may be marked taken. */
  takeWindowBeforeMinutes: Number(process.env.TAKE_WINDOW_BEFORE_MINUTES ?? 15),
  pairingCodeTtlMinutes: Number(process.env.PAIRING_CODE_TTL_MINUTES ?? 15),
  /**
   * Phase 2 LLM: `auto` (Gemini first, then Anthropic), `google`, or `anthropic`.
   * Free tier: get a Gemini key at https://aistudio.google.com/apikey
   */
  llmProvider: (process.env.LLM_PROVIDER?.trim().toLowerCase() || 'auto') as 'auto' | 'google' | 'anthropic',
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() ?? '',
  geminiModel: process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY?.trim() ?? '',
  anthropicBaseUrl: process.env.ANTHROPIC_BASE_URL?.trim() || undefined,
  anthropicModel: process.env.ANTHROPIC_MODEL?.trim() || 'claude-3-5-haiku-latest',

  corsOrigin(): true | string[] {
    const raw = process.env.CORS_ORIGIN?.trim();
    if (!raw || raw === '*') return true;
    return raw.split(',').map((o) => o.trim());
  },
};
