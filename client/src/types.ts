export type IdeaCategory = 'business' | 'content' | 'hobby';

export type ConversationPhase =
  | 'WELCOME'
  | 'TARGET_USER'
  | 'CORE_PROBLEM'
  | 'DIFFERENTIATOR'
  | 'VALUE_PROP'
  | 'COMPLETE';

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
