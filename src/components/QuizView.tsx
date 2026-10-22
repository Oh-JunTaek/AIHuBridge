import { useState } from 'react';
import type { Question } from '../lib/quiz';
import { useUser } from '../lib/user';
import { CheckIcon, XIcon, SparkleIcon } from './icons';

export function QuizView({ question }: { question: Question }) {
  const { state, mutate } = useUser();
  const [picked, setPicked] = useState<number | null>(null);
  const ok = picked !== null && picked === question.answerIndex;

  const submit = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const prev = state.quizHistory;
    const entry = {
      id: question.id,
      term: question.term,
      answered: question.options[i],
      correct: question.term,
      ok: i === question.answerIndex,
      at: new Date().toISOString(),
    };
    mutate({ quizHistory: [...prev, entry] });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <header className="mb-3 flex items-center gap-2">
        <SparkleIcon className="h-5 w-5 text-violet-500" />
        <h2 className="text-sm font-semibold text-slate-800">용어 맞추기</h2>
      </header>

      <p className="text-sm text-slate-700">다음은 어떤 용어에 대한 설명인가요?</p>
      <blockquote className="mt-2 rounded-lg bg-slate-50 p-3 text-sm italic text-slate-800">
        “{question.definition}”
      </blockquote>

      <ul className="mt-4 grid gap-2 text-sm">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.answerIndex;
          const selected = picked === i;
          let bg = 'bg-white';
          let border = 'border-slate-200';
          let txt = 'text-slate-800';
          if (picked !== null) {
            if (isCorrect) { bg='bg-emerald-50'; border='border-emerald-300'; txt='text-emerald-800'; }
            else if (selected) { bg='bg-rose-50'; border='border-rose-300'; txt='text-rose-800'; }
          }
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => submit(i)}
              className={`flex items-center gap-2 rounded-lg border ${bg} ${border} ${txt} p-2.5 text-left hover:bg-slate-100 disabled:cursor-default`}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </ul>

      {picked !== null && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm">
          {ok ? <CheckIcon className="h-5 w-5 text-emerald-600" /> : <XIcon className="h-5 w-5 text-rose-600" />}
          <span>
            {ok
              ? '정답! 🎉'
              : `틀렸어요. 정답은 “${question.term}”예요.`}
          </span>
        </div>
      )}

      {question.example && picked !== null && (
        <p className="mt-2 text-xs text-slate-500">예) {question.example}</p>
      )}
    </div>
  );
}
