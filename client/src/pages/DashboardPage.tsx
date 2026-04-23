import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import IdeaCard from '../components/IdeaCard';
import type { SavedIdea } from '../types';

export default function DashboardPage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getIdeas()
      .then(({ ideas }) => setIdeas(ideas))
      .catch(() => setError('Failed to load ideas.'))
      .finally(() => setIsLoading(false));
  }, []);

  function handleRatingUpdate(id: string, rating: number) {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, rating } : idea))
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Ideas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {ideas.length === 0 ? 'No saved ideas yet' : `${ideas.length} saved idea${ideas.length === 1 ? '' : 's'}`}
          </p>
        </div>

        <Link
          to="/create"
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New idea
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 text-center py-8">{error}</div>
      )}

      {!isLoading && !error && ideas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700 mb-1">No ideas saved yet</p>
            <p className="text-xs text-slate-500">
              Complete a coaching session and save your idea to see it here.
            </p>
          </div>
          <Link
            to="/create"
            className="text-sm text-brand-500 font-medium hover:underline"
          >
            Start your first idea
          </Link>
        </div>
      )}

      {!isLoading && ideas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onRatingUpdate={handleRatingUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
