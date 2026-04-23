import { useState } from 'react';
import type { SavedIdea } from '../types';
import { api } from '../api';

interface Props {
  idea: SavedIdea;
  onRatingUpdate: (id: string, rating: number) => void;
}

const categoryColors: Record<SavedIdea['category'], string> = {
  business: 'text-blue-600 bg-blue-50',
  content: 'text-violet-600 bg-violet-50',
  hobby: 'text-emerald-600 bg-emerald-50',
};

function StarDisplay({ rating, onRate }: { rating?: number; onRate: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating || 0;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`w-4 h-4 transition-colors ${star <= display ? 'text-amber-400' : 'text-slate-200'}`}
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

export default function IdeaCard({ idea, onRatingUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isRating, setIsRating] = useState(false);

  const date = new Date(idea.savedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  async function handleRate(rating: number) {
    if (isRating) return;
    setIsRating(true);
    try {
      await api.rateIdea(idea.id, rating);
      onRatingUpdate(idea.id, rating);
    } finally {
      setIsRating(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <span
              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md mb-2 ${categoryColors[idea.category]}`}
            >
              {idea.category}
            </span>
            <h3 className="font-semibold text-slate-900 text-sm leading-snug">{idea.title}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
          {idea.description}
        </p>

        <div className="flex items-center justify-between">
          <StarDisplay rating={idea.rating} onRate={handleRate} />
          <span className="text-xs text-slate-400">{date}</span>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          View Summary
          <svg
            className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-3 animate-fade-in border-t border-slate-100">
            <SummarySection label="Audience" value={idea.summary.targetAudience} />
            <SummarySection label="Problem" value={idea.summary.coreProblem} />
            <SummarySection label="Value" value={idea.summary.valueProposition} />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Key Features
              </p>
              <ul className="space-y-1">
                {idea.summary.keyFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1 h-1 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummarySection({ label, value }: { label: string; value: string }) {
  return (
    <div className="pt-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xs text-slate-600 leading-relaxed">{value}</p>
    </div>
  );
}
