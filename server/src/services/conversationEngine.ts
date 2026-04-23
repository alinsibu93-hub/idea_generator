import { v4 as uuidv4 } from 'uuid';
import { callClaude } from '../lib/anthropic';
import {
  buildCoachSystemPrompt,
  buildConversationHistory,
  buildSummarySystemPrompt,
  parseCoachResponse,
  parseSummaryResponse,
} from '../prompts/coachPrompts';
import type {
  ChatMessage,
  ChatSession,
  ConversationPhase,
  ConversationTurn,
  IdeaDraft,
  IdeaSummary,
} from '../types';
import { PHASE_ORDER } from '../types';

// ─── Phase Integrity Guard ─────────────────────────────────────────────────────
//
// The AI is trusted to advance phases, but not to skip or reverse them.
// This guard ensures conversation integrity regardless of what the model returns.

function sanitizePhaseTransition(
  current: ConversationPhase,
  proposed: ConversationPhase
): ConversationPhase {
  const currentIdx = PHASE_ORDER.indexOf(current);
  const proposedIdx = PHASE_ORDER.indexOf(proposed);

  if (proposedIdx < currentIdx) return current;                           // never go back
  if (proposedIdx > currentIdx + 1) return PHASE_ORDER[currentIdx + 1];  // never skip ahead
  return proposed;
}

function makeMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return { id: uuidv4(), role, content, timestamp: new Date().toISOString() };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Creates a new coaching session and generates the coach's opening message.
 * Returns a fully-formed ChatSession ready to be persisted.
 */
export async function openSession(idea: IdeaDraft): Promise<ChatSession> {
  const session: ChatSession = {
    id: uuidv4(),
    idea,
    phase: 'WELCOME',
    messages: [],
    isComplete: false,
    createdAt: new Date().toISOString(),
  };

  const systemPrompt = buildCoachSystemPrompt(idea, 'WELCOME');
  // For the opening, session.messages is empty — buildConversationHistory produces
  // only the synthetic opener, which is exactly what we want.
  const raw = await callClaude(systemPrompt, buildConversationHistory(session));
  const response = parseCoachResponse(raw, 'WELCOME');

  return {
    ...session,
    messages: [makeMessage('assistant', response.message)],
    phase: sanitizePhaseTransition('WELCOME', response.phase),
    isComplete: response.isComplete,
  };
}

/**
 * Advances an ongoing session by one user turn.
 * Returns the two new messages and the updated conversation state.
 * Does NOT mutate the session — the caller applies the turn and persists.
 */
export async function advanceConversation(
  session: ChatSession,
  userText: string
): Promise<ConversationTurn> {
  const userMessage = makeMessage('user', userText);

  // Build a temporary view of the session that includes the new user message
  // so the AI sees the full conversation, including what the user just said.
  const sessionWithNewTurn: ChatSession = {
    ...session,
    messages: [...session.messages, userMessage],
  };

  const systemPrompt = buildCoachSystemPrompt(session.idea, session.phase);
  const raw = await callClaude(systemPrompt, buildConversationHistory(sessionWithNewTurn));
  const response = parseCoachResponse(raw, session.phase);

  return {
    userMessage,
    botMessage: makeMessage('assistant', response.message),
    phase: sanitizePhaseTransition(session.phase, response.phase),
    isComplete: response.isComplete,
  };
}

/**
 * Synthesises the completed conversation into a structured idea summary.
 * Called explicitly by the user after the conversation is complete.
 */
export async function synthesizeSummary(session: ChatSession): Promise<IdeaSummary> {
  const systemPrompt = buildSummarySystemPrompt(session.idea.title);

  const transcript = session.messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
    .join('\n');

  const raw = await callClaude(
    systemPrompt,
    [{ role: 'user', content: `CONVERSATION:\n${transcript}` }],
    1500
  );

  return parseSummaryResponse(raw);
}
