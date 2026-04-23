import type { ChatMessage } from '../types';

// ─── Coach Message ────────────────────────────────────────────────────────────
//
// The coach's question is the primary unit of this UI. It should dominate:
// full width, anchored by a left accent line that draws the eye on arrival.
//
// isActive: true for the most recent coach message — the one awaiting a
// response. Active messages get the accent color; past ones recede.

interface CoachMessageProps {
  message: ChatMessage;
  isActive: boolean;
}

export function CoachMessage({ message, isActive }: CoachMessageProps) {
  return (
    <div
      className={`pl-4 border-l-2 transition-colors duration-500 ${
        isActive ? 'border-indigo-500' : 'border-slate-200'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2 select-none">
        Idea Coach
      </p>
      <p
        className={`text-[15px] leading-relaxed transition-colors duration-500 ${
          isActive ? 'text-slate-900' : 'text-slate-500'
        }`}
      >
        {message.content}
      </p>
    </div>
  );
}

// ─── User Reply ───────────────────────────────────────────────────────────────
//
// The user's answer is secondary — it responds to the coach's question.
// Right-aligned and visually contained so it doesn't compete for attention.

interface UserReplyProps {
  message: ChatMessage;
}

export function UserReply({ message }: UserReplyProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[68%] bg-slate-100 rounded-xl px-4 py-3">
        <p className="text-sm text-slate-700 leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}

// ─── Thinking Indicator ───────────────────────────────────────────────────────
//
// Shown while the coach is generating a response. Intentionally replaces
// the input area — the user cannot type until the coach has responded.
// Named for what it represents, not what it looks like.

export function ThinkingIndicator() {
  return (
    <div className="pl-4 border-l-2 border-indigo-500">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2 select-none">
        Idea Coach
      </p>
      <div className="flex gap-1.5 items-center h-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
