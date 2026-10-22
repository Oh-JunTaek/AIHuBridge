import { useState } from 'react';
import { todaysQuestion, quickQuiz } from '../lib/quiz';
import { QuizView } from '../components/QuizView';
import { useUser } from '../lib/user';

export default function Quiz() {
  const { state } = useUser();
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
        <h1 className="text-2xl font-bold text-slate-800">퀴즈</h1>
        <span className="text-sm text-slate-500">
          정답률 {total ? Math.round((passed / total) * 100) : 0}% ({passed}/{total})
        </span>
      </header>

      <nav className="mb-5 flex gap-2 text-sm">
        <button
          onClick={() => setMode('daily')}
          className={`rounded-full px-4 py-1.5 font-medium ${
            mode === 'daily' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          📅 오늘의 문제
        </button>
        <button
          onClick={startPractice}
          className={`rounded-full px-4 py-1.5 font-medium ${
            mode === 'practice' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          🎯 연습 8문제
        </button>
      </nav>

      <QuizView question={currentQ} />

      {mode === 'practice' && idx < (list.length - 1) && (
        <div className="mt-4 text-center">
          <button
            onClick={next}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            다음 문제
          </button>
        </div>
      )}

      {mode === 'daily' && list.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          내일도 새 문제가 등장해요. (날짜에 따라 문항이 달라집니다)
        </p>
      )}
    </div>
  );
}
