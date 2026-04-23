// ─── Idea Domain ──────────────────────────────────────────────────────────────

export const VALID_CATEGORIES = ['business', 'content', 'hobby'] as const;
export type IdeaCategory = (typeof VALID_CATEGORIES)[number];

export interface IdeaDraft {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  preferences: string[];
  createdAt: string;
}

export interface IdeaSummary {
  targetAudience: string;
  coreProblem: string;
  valueProposition: string;
  keyFeatures: string[];
}

export interface SavedIdea extends IdeaDraft {
  summary: IdeaSummary;
  rating?: number;
  savedAt: string;
  sessionId: string;
}

// ─── Conversation Domain ──────────────────────────────────────────────────────

export const PHASE_ORDER = [
  'WELCOME',
  'TARGET_USER',
  'CORE_PROBLEM',
  'DIFFERENTIATOR',
  'VALUE_PROP',
  'COMPLETE',
] as const;

export type ConversationPhase = (typeof PHASE_ORDER)[number];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  idea: IdeaDraft;
  phase: ConversationPhase;
  messages: ChatMessage[];
  summary?: IdeaSummary;
  isComplete: boolean;
  createdAt: string;
}

// Returned by advanceConversation — captures everything the route needs to persist.
export interface ConversationTurn {
  userMessage: ChatMessage;
  botMessage: ChatMessage;
  phase: ConversationPhase;
  isComplete: boolean;
}

// ─── AI Infrastructure ────────────────────────────────────────────────────────

// The message shape the Claude API expects.
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

// The structured response the coach prompt contract produces.
export interface CoachResponse {
  message: string;
  phase: ConversationPhase;
  isComplete: boolean;
}
