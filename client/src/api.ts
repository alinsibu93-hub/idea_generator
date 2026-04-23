import type { ChatSession, IdeaCategory, IdeaDraft, IdeaSummary, SavedIdea } from './types';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? data.error ?? 'Request failed');
  }

  return data as T;
}

export const api = {
  generateIdea(category: IdeaCategory, preferences: string[]) {
    return request<{ idea: IdeaDraft }>('/ideas/generate', {
      method: 'POST',
      body: JSON.stringify({ category, preferences }),
    });
  },

  createSession(idea: IdeaDraft) {
    return request<{ session: ChatSession }>('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ idea }),
    });
  },

  getSession(id: string) {
    return request<{ session: ChatSession }>(`/chat/sessions/${id}`);
  },

  sendMessage(sessionId: string, message: string) {
    return request<{
      userMessage: ChatSession['messages'][0];
      botMessage: ChatSession['messages'][0];
      phase: ChatSession['phase'];
      isComplete: boolean;
    }>(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  generateSummary(sessionId: string) {
    return request<{ summary: IdeaSummary }>(`/chat/sessions/${sessionId}/summary`, {
      method: 'POST',
    });
  },

  saveIdea(sessionId: string, rating?: number) {
    return request<{ idea: SavedIdea }>('/ideas', {
      method: 'POST',
      body: JSON.stringify({ sessionId, rating }),
    });
  },

  getIdeas() {
    return request<{ ideas: SavedIdea[] }>('/ideas');
  },

  rateIdea(id: string, rating: number) {
    return request<{ idea: SavedIdea }>(`/ideas/${id}/rating`, {
      method: 'PATCH',
      body: JSON.stringify({ rating }),
    });
  },
};
