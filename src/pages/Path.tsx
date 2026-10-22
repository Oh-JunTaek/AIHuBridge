import { stages } from '../data/path';
import { StageCard } from '../components/StageCard';
import { useUser } from '../lib/user';
import { Link } from 'react-router-dom';

export default function Path() {
  const { state } = useUser();
  const total = stages.reduce((s, st) => s + st.items.length, 0);
  const done = stages.reduce(
    (s, st) => s + st.items.filter((it) => state.completedCourseIds.includes(it.id)).length,
    0,
  );
  const pct = Math.round((done / total) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">학습 경로</h1>
          <p className="mt-1 text-sm text-slate-500">
            비전공자를 위한 4단계 루트 — 완료하면 뱃지가 생겨요
          </p>
        </div>
        <Link
          to="/certs"
          className="text-xs font-medium text-slate-500 hover:text-blue-600"
        >
          뱃지 보러 가기 →
        </Link>
      </header>

      <div className="mb-6 h-3 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mb-6 text-sm text-slate-600">
        {done}/{total} 항목 완료 ({pct}%)
      </p>

      <div className="grid gap-4">
        {stages.map((s) => (
          <StageCard key={s.id} stage={s} />
        ))}
      </div>
    </div>
  );
}
