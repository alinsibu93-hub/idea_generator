import { v4 as uuidv4 } from 'uuid';
import { callClaude } from '../lib/anthropic';
import {
  buildIdeaUserMessage,
  IDEA_GENERATION_SYSTEM_PROMPT,
  parseIdeaResponse,
} from '../prompts/ideaPrompts';
import type { ChatSession, IdeaCategory, IdeaDraft, SavedIdea } from '../types';
import { AppError } from '../lib/AppError';

/**
 * Calls the AI to generate an idea draft and returns a fully-formed IdeaDraft
 * with a unique ID, ready to be used in a session.
 */
export async function generateIdeaDraft(
  category: IdeaCategory,
  preferences: string[]
): Promise<IdeaDraft> {
  const raw = await callClaude(IDEA_GENERATION_SYSTEM_PROMPT, [
    { role: 'user', content: buildIdeaUserMessage(category, preferences) },
  ]);

  const { title, description } = parseIdeaResponse(raw);

  return {
    id: uuidv4(),
    title,
    description,
    category,
    preferences,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Builds a SavedIdea from a completed session. Validates that the session
 * has a summary before allowing a save.
 */
export function buildSavedIdea(session: ChatSession, rating?: number): SavedIdea {
  if (!session.summary) {
    throw new AppError(400, 'A summary must be generated before saving the idea');
  }

  return {
    ...session.idea,
    summary: session.summary,
    rating,
    savedAt: new Date().toISOString(),
    sessionId: session.id,
  };
}
