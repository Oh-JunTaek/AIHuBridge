import type { Stage } from '../data/path';
import { useUser } from '../lib/user';
import { getCert } from '../lib/certs';
import { glossary } from '../data/glossary';
import { CheckIcon, ClockIcon } from './icons';

export function StageCard({ stage }: { stage: Stage }) {
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
                {refLabel && (
                  <span className="line-clamp-1 text-xs text-slate-500">
                    {refLabel}
                  </span>
                )}
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
