import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CoachMessage, UserReply, ThinkingIndicator } from '../components/ChatMessage';
import PhaseIndicator from '../components/PhaseIndicator';
import SummaryCard from '../components/SummaryCard';
import { useCoachSession } from '../hooks/useCoachSession';
import { useSummary } from '../hooks/useSummary';

function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return ref;
}

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { session, status, errorMessage, send, clearError } = useCoachSession(sessionId);
  const { summary, status: summaryStatus, errorMessage: summaryError, generate, save } =
    useSummary(sessionId, session);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useAutoResize(input);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, status, summary, summaryStatus]);

  async function handleSend() {
    const text = input.trim();
    if (!text || status === 'sending') return;
    setInput('');
    clearError();
    await send(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 h-full">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
        <p className="text-sm text-slate-500">Loading your session...</p>
      </div>
    );
  }

  if ((status === 'error' && !session) || !session) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 h-full">
        <p className="text-sm text-slate-600 font-medium">Session not found.</p>
        <Link to="/create" className="text-sm text-indigo-500 hover:underline">
          Start a new idea
        </Link>
      </div>
    );
  }

  const isSending = status === 'sending';
  const lastMessageIndex = session.messages.length - 1;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/"
            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="font-semibold text-slate-900 text-sm truncate">{session.idea.title}</h1>
            <span className="text-xs text-slate-400 capitalize">{session.idea.category}</span>
          </div>
        </div>
        {!session.isComplete && <PhaseIndicator currentPhase={session.phase} />}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {session.messages.map((msg, i) => {
          if (msg.role === 'assistant') {
            // Active = the current unanswered question; all prior questions recede
            const isActive = i === lastMessageIndex && !session.isComplete && !isSending;
            return <CoachMessage key={msg.id} message={msg} isActive={isActive} />;
          }
          return <UserReply key={msg.id} message={msg} />;
        })}

        {isSending && <ThinkingIndicator />}

        {/* Completion transition — a deliberate pause before synthesis */}
        {session.isComplete && !summary && summaryStatus !== 'generating' && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">Session complete</p>
              <p className="text-sm text-slate-500 max-w-xs">
                The conversation has established the foundation of your idea.
              </p>
            </div>
            <button
              onClick={generate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Synthesise your idea
            </button>
          </div>
        )}

        {summaryStatus === 'generating' && (
          <div className="flex items-center gap-3 py-6">
            <div className="w-4 h-4 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin flex-shrink-0" />
            <p className="text-sm text-slate-500">Synthesising your idea...</p>
          </div>
        )}

        {summary && (
          <SummaryCard
            summary={summary}
            onSave={save}
            isSaving={summaryStatus === 'saving'}
            isSaved={summaryStatus === 'saved'}
          />
        )}

        {(errorMessage || summaryError) && (
          <p className="text-xs text-red-500 text-center">{errorMessage || summaryError}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input — entirely absent while thinking, not just disabled */}
      {!session.isComplete && !isSending && (
        <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              rows={1}
              className="flex-1 resize-none text-sm px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 leading-relaxed max-h-32 overflow-y-auto"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Enter to send · Shift+Enter for newline</p>
        </div>
      )}
    </div>
  );
}
