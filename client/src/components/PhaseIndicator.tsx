import type { ConversationPhase } from '../types';

// Each phase has a label (the headline) and a description (what this phase
// is trying to establish). The description grounds the user: they know not
// just where they are, but what the current exchange is for.

const PHASE_META: Record<
  ConversationPhase,
  { label: string; description: string; progress: number }
> = {
  WELCOME: {
    label: 'Getting started',
    description: 'The coach is reviewing your idea.',
    progress: 0,
  },
  TARGET_USER: {
    label: 'Target user',
    description: 'Establishing exactly who this idea is for.',
    progress: 25,
  },
  CORE_PROBLEM: {
    label: 'Core problem',
    description: 'Identifying the specific friction this removes.',
    progress: 50,
  },
  DIFFERENTIATOR: {
    label: 'Differentiator',
    description: 'Finding what makes this approach unique.',
    progress: 75,
  },
  VALUE_PROP: {
    label: 'Value proposition',
    description: 'Synthesising everything into one testable statement.',
    progress: 90,
  },
  COMPLETE: {
    label: 'Session complete',
    description: 'The coaching session has concluded.',
    progress: 100,
  },
};

interface Props {
  currentPhase: ConversationPhase;
}

export default function PhaseIndicator({ currentPhase }: Props) {
  const meta = PHASE_META[currentPhase];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-0.5">
        <span className="text-sm font-semibold text-slate-900">{meta.label}</span>
        {currentPhase !== 'WELCOME' && currentPhase !== 'COMPLETE' && (
          <span className="text-xs text-slate-400 tabular-nums">
            {meta.progress}%
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-2">{meta.description}</p>
      <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${meta.progress}%` }}
        />
      </div>
    </div>
  );
}
