import { Link } from 'react-router-dom';

// ─── Content ──────────────────────────────────────────────────────────────────

const IS_ITEMS = [
  'A guided thinking process',
  'A series of probing questions',
  'A way to stress-test your assumptions',
  'A framework for articulating what you already know',
];

const IS_NOT_ITEMS = [
  'A generator that writes ideas for you',
  'A brainstorming tool or idea list',
  'Advice or evaluation of your idea',
  'A shortcut to a pitch deck',
];

const STEPS = [
  {
    number: '1',
    label: 'You describe your idea',
    explanation:
      'Pick a focus area and add a few interests or constraints. The coach uses these to frame the starting point for your session.',
  },
  {
    number: '2',
    label: 'The coach asks questions',
    explanation:
      'One question at a time, in a fixed sequence. Each question builds on your previous answer. You cannot skip ahead.',
  },
  {
    number: '3',
    label: 'You get a summary',
    explanation:
      "At the end, the session is distilled into a structured statement: who it's for, what it solves, and why it's different.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <header className="flex items-baseline justify-between">
      <span className="text-sm font-medium text-slate-900">Idea Coach</span>
      <Link
        to="/dashboard"
        className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
      >
        Saved ideas
      </Link>
    </header>
  );
}

function SessionIntro() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900 leading-snug mb-4">
        A structured way to think through an idea.
      </h1>
      <p className="text-base text-slate-600 leading-relaxed mb-3">
        You'll be asked a series of questions — one at a time — that help you name who this is
        for, what problem it solves, and what makes it different.
      </p>
      <p className="text-sm text-slate-500">This takes about 15 minutes. There are no shortcuts.</p>
    </section>
  );
}

function ExpectationMatrix() {
  return (
    <section>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            This is
          </p>
          <ul className="space-y-2" aria-label="What this is">
            {IS_ITEMS.map((item) => (
              <li key={item} className="text-sm text-slate-700 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            This is not
          </p>
          <ul className="space-y-2" aria-label="What this is not">
            {IS_NOT_ITEMS.map((item) => (
              <li key={item} className="text-sm text-slate-500 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ProcessSteps() {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-5">
        How it works
      </p>
      <ol className="space-y-5">
        {STEPS.map(({ number, label, explanation }) => (
          <li key={number} className="flex gap-5">
            <span className="text-[11px] font-semibold text-slate-300 tabular-nums pt-0.5 w-3 flex-shrink-0">
              {number}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">{label}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{explanation}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SessionEntryPoint() {
  return (
    <section className="border-t border-b border-slate-100 py-8">
      <Link
        to="/create"
        className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Start a coaching session
      </Link>
      <p className="text-xs text-slate-400 text-center mt-3">
        You'll spend a few minutes setting up your idea before the session begins.
      </p>
    </section>
  );
}

function ReturningUserNote() {
  return (
    <p className="text-sm text-slate-400 text-center">
      Have a saved session?{' '}
      <Link
        to="/dashboard"
        className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-2 hover:underline"
      >
        View saved ideas
      </Link>
    </p>
  );
}

function PageFooter() {
  return (
    <footer className="border-t border-slate-100 pt-6 pb-2">
      <p className="text-xs text-slate-400 text-center">Idea Coach · Built with Claude</p>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-full bg-white">
      <div className="max-w-[640px] mx-auto px-8 py-12 space-y-14">
        <PageHeader />
        <SessionIntro />
        <ExpectationMatrix />
        <ProcessSteps />
        <SessionEntryPoint />
        <ReturningUserNote />
        <PageFooter />
      </div>
    </div>
  );
}
