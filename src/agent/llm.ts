import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';
import { env } from '../env.js';

export type LlmProvider = 'google' | 'anthropic';

/**
 * Pick an LLM. Free path: Google Gemini (`GEMINI_API_KEY`).
 * Optional: Anthropic (`ANTHROPIC_API_KEY`).
 * `LLM_PROVIDER=auto|google|anthropic` (default auto = Gemini first, then Anthropic).
 */
export function resolveLlm(): { provider: LlmProvider; model: LanguageModel } | null {
  const want = env.llmProvider;

  const gemini = () => {
    if (!env.geminiApiKey) return null;
    const google = createGoogleGenerativeAI({ apiKey: env.geminiApiKey });
    return { provider: 'google' as const, model: google(env.geminiModel) };
  };

  const claude = () => {
    if (!env.anthropicApiKey) return null;
    const anthropic = createAnthropic({
      apiKey: env.anthropicApiKey,
      ...(env.anthropicBaseUrl ? { baseURL: env.anthropicBaseUrl } : {}),
    });
    return { provider: 'anthropic' as const, model: anthropic(env.anthropicModel) };
  };

  if (want === 'google') return gemini();
  if (want === 'anthropic') return claude();
  return gemini() ?? claude();
}
