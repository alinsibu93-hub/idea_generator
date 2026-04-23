import type { ChatSession, SavedIdea } from '../types';

/**
 * In-memory store for sessions and saved ideas.
 *
 * Swap contract: replace this class with a DB-backed implementation that
 * exposes the same interface. No other file needs to change.
 *
 * Sessions are ephemeral (lost on restart by design — they're a work-in-progress).
 * SavedIdeas are the user's permanent record.
 */
class SessionStore {
  private readonly sessions = new Map<string, ChatSession>();
  private readonly ideas = new Map<string, SavedIdea>();

  // ─── Sessions ──────────────────────────────────────────────────────────────

  getSession(id: string): ChatSession | undefined {
    return this.sessions.get(id);
  }

  upsertSession(session: ChatSession): void {
    this.sessions.set(session.id, session);
  }

  // ─── Saved Ideas ───────────────────────────────────────────────────────────

  getAllIdeas(): SavedIdea[] {
    return Array.from(this.ideas.values()).sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }

  getIdea(id: string): SavedIdea | undefined {
    return this.ideas.get(id);
  }

  saveIdea(idea: SavedIdea): void {
    if (this.ideas.has(idea.id)) {
      throw new Error(`Idea ${idea.id} has already been saved`);
    }
    this.ideas.set(idea.id, idea);
  }

  updateRating(id: string, rating: number): SavedIdea | undefined {
    const idea = this.ideas.get(id);
    if (!idea) return undefined;
    const updated = { ...idea, rating };
    this.ideas.set(id, updated);
    return updated;
  }
}

export const sessionStore = new SessionStore();
