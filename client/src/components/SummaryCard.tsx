import { useState } from 'react';
import type { IdeaSummary } from '../types';

interface Props {
  summary: IdeaSummary;
  onSave: (rating?: number) => void;
  isSaving: boolean;
  isSaved: boolean;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              star <= display ? 'text-amber-400' : 'text-slate-200'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function SummaryCard({ summary, onSave, isSaving, isSaved }: Props) {
  const [rating, setRating] = useState(0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-slate-100">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Idea Summary
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Value proposition — the synthesis; given visual weight */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Value Proposition
          </p>
          <p className="text-[15px] leading-relaxed text-slate-900 pl-4 border-l-2 border-indigo-500">
            {summary.valueProposition}
          </p>
        </div>

        <div className="h-px bg-slate-100" />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
            Target User
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{summary.targetAudience}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
            Core Problem
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{summary.coreProblem}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Key Capabilities
          </p>
          <ul className="space-y-1.5">
            {summary.keyFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-6 pb-5 pt-4 border-t border-slate-100">
        {isSaved ? (
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Saved to My Ideas
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Rate this idea
              </p>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <button
              onClick={() => onSave(rating > 0 ? rating : undefined)}
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save to My Ideas'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
