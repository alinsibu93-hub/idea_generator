import { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { IdeaCategory } from '../types';

const CATEGORIES: { key: IdeaCategory; label: string; desc: string; icon: JSX.Element }[] = [
  {
    key: 'business',
    label: 'Business',
    desc: 'Startups, products, services, or side-projects',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    key: 'content',
    label: 'Content',
    desc: 'Social media, YouTube, blogs, newsletters',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'hobby',
    label: 'Hobby',
    desc: 'Personal projects, crafts, sports, learning',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

type Step = 'category' | 'preferences' | 'generating';

export default function CreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<IdeaCategory | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  function addPreference() {
    const trimmed = inputValue.trim();
    if (!trimmed || preferences.includes(trimmed) || preferences.length >= 5) return;
    setPreferences((prev) => [...prev, trimmed]);
    setInputValue('');
  }

  function removePreference(pref: string) {
    setPreferences((prev) => prev.filter((p) => p !== pref));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addPreference();
    }
  }

  async function handleGenerate() {
    if (!category || preferences.length === 0) {
      setError('Add at least one preference to continue.');
      return;
    }

    setError('');
    setStep('generating');

    try {
      const { idea } = await api.generateIdea(category, preferences);
      const { session } = await api.createSession(idea);
      navigate(`/chat/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStep('preferences');
    }
  }

  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin" />
        <p className="font-semibold text-slate-800 text-sm">Setting up your session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full px-8 py-12">
      {step === 'category' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-1">What kind of idea?</h2>
          <p className="text-sm text-slate-500 mb-6">Choose a category to get started.</p>

          <div className="space-y-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setCategory(cat.key);
                  setStep('preferences');
                }}
                className="w-full flex items-center gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all text-left group"
              >
                <div className="w-11 h-11 rounded-lg bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center text-slate-500 group-hover:text-brand-600 transition-colors flex-shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{cat.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                </div>
                <svg
                  className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors ml-auto flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'preferences' && category && (
        <div className="animate-fade-in">
          <button
            onClick={() => setStep('category')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h2 className="text-xl font-bold text-slate-900 mb-1">What's on your mind?</h2>
          <p className="text-sm text-slate-500 mb-6">
            Add 2–3 preferences, interests, or constraints. Press Enter after each one.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. remote workers, sustainable, low budget..."
                className="flex-1 text-sm px-3.5 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-400"
                autoFocus
              />
              <button
                onClick={addPreference}
                disabled={!inputValue.trim() || preferences.length >= 5}
                className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-sm font-medium px-3.5 py-2.5 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            {preferences.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <span
                    key={pref}
                    className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {pref}
                    <button
                      onClick={() => removePreference(pref)}
                      className="hover:text-brand-900 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500 mb-4">{error}</p>
          )}

          <button
            onClick={handleGenerate}
            disabled={preferences.length === 0}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Start coaching session
          </button>
        </div>
      )}
    </div>
  );
}
