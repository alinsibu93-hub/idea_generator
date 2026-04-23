import type { IdeaCategory } from '../types';
import { AppError } from '../lib/AppError';

export const IDEA_GENERATION_SYSTEM_PROMPT = `\
You are a creative idea generator. Given a category and a list of user preferences, \
produce a specific, realistic, and actionable idea tailored precisely to what was provided.

Output ONLY valid JSON — no commentary, no markdown fences:
{
  "title":       "concise idea title, 5-8 words",
  "description": "clear description of the idea, 2-3 sentences covering what it is and who it serves"
}

Rules:
- Be specific, never generic — "a subscription box for urban cyclists" beats "a subscription service"
- Make it realistic and achievable given the preferences
- Avoid buzzwords, hype language, and clichés`;

export function buildIdeaUserMessage(category: IdeaCategory, preferences: string[]): string {
  return `Category: ${category}\nPreferences: ${preferences.join(', ')}`;
}

export function parseIdeaResponse(raw: string): { title: string; description: string } {
  // Try direct parse first, then fall back to regex extraction.
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        // fall through to error below
      }
    }
  }

  if (!parsed || typeof parsed.title !== 'string' || typeof parsed.description !== 'string') {
    throw new AppError(502, 'Idea generator returned an unrecognisable response');
  }

  return { title: parsed.title, description: parsed.description };
}
