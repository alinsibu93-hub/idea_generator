import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import type { ChatSession } from '../types';

export type SessionStatus = 'loading' | 'ready' | 'sending' | 'error';

export interface UseCoachSession {
  session: ChatSession | null;
  status: SessionStatus;
  errorMessage: string;
  send: (text: string) => Promise<void>;
  clearError: () => void;
}

export function useCoachSession(sessionId: string | undefined): UseCoachSession {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    setStatus('loading');
    api
      .getSession(sessionId)
      .then(({ session }) => {
        if (!mounted.current) return;
        setSession(session);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted.current) return;
        setStatus('error');
      });
  }, [sessionId]);

  async function send(text: string): Promise<void> {
    if (!sessionId || !session || status === 'sending') return;
    setStatus('sending');
    setErrorMessage('');
    try {
      const result = await api.sendMessage(sessionId, text);
      if (!mounted.current) return;
      setSession((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, result.userMessage, result.botMessage],
              phase: result.phase,
              isComplete: result.isComplete,
            }
          : prev
      );
      setStatus('ready');
    } catch {
      if (!mounted.current) return;
      setErrorMessage('Failed to send. Please try again.');
      setStatus('ready');
    }
  }

  return { session, status, errorMessage, send, clearError: () => setErrorMessage('') };
}
