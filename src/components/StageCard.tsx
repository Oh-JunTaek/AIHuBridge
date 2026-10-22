import type { Stage, Level, PCategory, PathFilter } from '../data/path';
import { useUser } from '../lib/user';
import { getCert } from '../lib/certs';
import { glossary } from '../data/glossary';
import { CheckIcon, ClockIcon } from './icons';

const levelColor: Record<Level, string> = {
  초급: 'bg-emerald-100 text-emerald-700',
  중급: 'bg-amber-100 text-amber-700',
  고급: 'bg-rose-100 text-rose-700',
};
const categoryColor: Record<PCategory, string> = {
  '개론/개념': 'bg-slate-100 text-slate-600',
  언어모델: 'bg-indigo-100 text-indigo-700',
  '프롬프트·도구': 'bg-cyan-100 text-cyan-700',
  '에이전트·앱': 'bg-purple-100 text-purple-700',
  '클라우드·MLOps': 'bg-blue-100 text-blue-700',
  '비즈니스·전략': 'bg-orange-100 text-orange-700',
};

export function StageCard({ stage, filter }: { stage: Stage; filter: PathFilter }) {
  const { state, mutate } = useUser();
  const completed = state.completedCourseIds;

  function toggle(id: string) {
    const next = completed.includes(id)
      ? completed.filter((x) => x !== id)
      : [...completed, id];
    mutate({ completedCourseIds: next });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <header className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{stage.icon}</span>
        <div>
          <h2 className="font-semibold text-slate-800">{stage.title}</h2>
          <p className="text-sm text-slate-500">{stage.subtitle}</p>
        </div>
      </header>

      <ul className="grid gap-2.5 text-sm">
        {stage.items.map((it) => {
          // 난이도/분야 필터에 맞지 않으면 목록에서 제외
          const hidden =
            (filter.level && it.level !== filter.level) ||
            (filter.category && it.category !== filter.category);
          if (hidden) return null;

          const done = completed.includes(it.id);
          const refLabel =
            it.kind === 'concept'
              ? glossary.find((g) => g.term === it.refId)?.definition
              : getCert(it.refId)?.name;
          return (
            <li
              key={it.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5"
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-800">{it.label}</span>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${levelColor[it.level]}`}
                    title="난이도"
                  >
                    {it.level}
                  </span>
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${categoryColor[it.category]}`}
                    title="분야"
                  >
                    {it.category}
                  </span>
                  {refLabel && (
                    <span className="line-clamp-1 text-xs text-slate-500">
                      {refLabel}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" /> {it.estMin}분
                </span>
                <button
                  className={`rounded p-1 ${
                    done
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                  onClick={() => toggle(it.id)}
                  title="완료 체크"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
