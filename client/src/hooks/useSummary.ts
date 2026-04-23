import { useEffect, useState } from 'react';
import { api } from '../api';
import type { ChatSession, IdeaSummary } from '../types';

export type SummaryStatus = 'idle' | 'generating' | 'ready' | 'saving' | 'saved' | 'error';

export interface UseSummary {
  summary: IdeaSummary | null;
  status: SummaryStatus;
  errorMessage: string;
  generate: () => Promise<void>;
  save: (rating?: number) => Promise<void>;
}

export function useSummary(
  sessionId: string | undefined,
  session: ChatSession | null
): UseSummary {
  const [summary, setSummary] = useState<IdeaSummary | null>(null);
  const [status, setStatus] = useState<SummaryStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Rehydrate if the session already has a summary (e.g. page reload).
  useEffect(() => {
    if (session?.summary && status === 'idle') {
      setSummary(session.summary);
      setStatus('ready');
    }
  }, [session?.summary]);

  async function generate(): Promise<void> {
    if (!sessionId || status === 'generating') return;
    setStatus('generating');
    setErrorMessage('');
    try {
      const { summary } = await api.generateSummary(sessionId);
      setSummary(summary);
      setStatus('ready');
    } catch {
      setErrorMessage('Could not generate summary. Please try again.');
      setStatus('error');
    }
  }

  async function save(rating?: number): Promise<void> {
    if (!sessionId || status === 'saving' || status === 'saved') return;
    setStatus('saving');
    try {
      await api.saveIdea(sessionId, rating);
      setStatus('saved');
    } catch {
      setErrorMessage('Could not save. Please try again.');
      setStatus('ready');
    }
  }

  return { summary, status, errorMessage, generate, save };
}
