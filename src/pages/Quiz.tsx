import { useState } from 'react';
import { todaysQuestion, quickQuiz } from '../lib/quiz';
import { QuizView } from '../components/QuizView';
import { useUser } from '../lib/user';
import { useT } from '../lib/i18n';

export default function Quiz() {
  const { state } = useUser();
  const t = useT();
  const [mode, setMode] = useState<'daily' | 'practice'>('daily');
  const [list, setList] = useState<ReturnType<typeof quickQuiz>>([]);
  const [idx, setIdx] = useState(0);

  const d = new Date().toISOString().slice(0, 10);
  const daily = todaysQuestion(d);

  const next = () => {
    if (mode === 'practice' && idx < list.length - 1) {
      setIdx(idx + 1);
    }
  };
  const startPractice = () => {
    setList(quickQuiz(8));
    setIdx(0);
    setMode('practice');
  };

  const currentQ = mode === 'daily' ? daily : list[idx];
  const history = state.quizHistory;
  const passed = history.filter((h) => h.ok).length;
  const total = history.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-stone-800">{t('quiz.title')}</h1>
        <span className="text-sm text-stone-500">
          {t('quiz.rate', total ? Math.round((passed / total) * 100) : 0, passed, total)}
        </span>
      </header>

      <nav className="mb-5 flex gap-2 text-sm">
        <button
          onClick={() => setMode('daily')}
          className={`rounded-full px-4 py-1.5 font-medium ${
            mode === 'daily' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
          }`}
        >
          {t('quiz.daily')}
        </button>
        <button
          onClick={startPractice}
          className={`rounded-full px-4 py-1.5 font-medium ${
            mode === 'practice' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
          }`}
        >
          {t('quiz.practice')}
        </button>
      </nav>

      <QuizView question={currentQ} />

      {mode === 'practice' && idx < (list.length - 1) && (
        <div className="mt-4 text-center">
          <button
            onClick={next}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            {t('quiz.next')}
          </button>
        </div>
      )}

      {mode === 'daily' && list.length === 0 && (
        <p className="mt-4 text-sm text-stone-500">
          {t('quiz.empty')}
        </p>
      )}
    </div>
  );
}
