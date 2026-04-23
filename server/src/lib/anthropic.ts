import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import type { ClaudeMessage } from '../types';

const client = new Anthropic({ apiKey: config.anthropicApiKey });

/**
 * Sends a single call to the Claude API and returns the raw text response.
 * This is infrastructure — it knows nothing about coaching, ideas, or sessions.
 * All prompt construction and response parsing happen in the callers.
 */
export async function callClaude(
  systemPrompt: string,
  messages: ClaudeMessage[],
  maxTokens = 1024
): Promise<string> {
  const response = await client.messages.create({
    model: config.claudeModel,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    console.error('[callClaude] No text block found. Content:', JSON.stringify(response.content));
    throw new Error(`Claude returned no text block. Types: ${response.content.map((b) => b.type).join(', ')}`);
  }
  return textBlock.text;
}
