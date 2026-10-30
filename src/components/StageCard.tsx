import { StageSymbol } from './StageSymbol';
import type { Stage, Level, PCategory, PathFilter } from '../data/path';
import { getCert } from '../lib/certs';
import { ClockIcon, ExternalLinkIcon } from './icons';
import { useT } from '../lib/i18n';
import { Link } from 'react-router-dom';
import { qualifications } from '../data/qualifications';

const levelColor: Record<Level, string> = {
  초급: 'bg-emerald-100 text-emerald-700',
  중급: 'bg-amber-100 text-amber-700',
  고급: 'bg-rose-100 text-rose-700',
};
const categoryColor: Record<PCategory, string> = {
  '개론/개념': 'bg-stone-100 text-stone-600',
  '프로그래밍·데이터': 'bg-teal-100 text-teal-800',
  'AI 수학': 'bg-sky-100 text-sky-800',
  언어모델: 'bg-indigo-100 text-indigo-700',
  '프롬프트·도구': 'bg-cyan-100 text-cyan-700',
  '에이전트·앱': 'bg-purple-100 text-purple-700',
  '클라우드·MLOps': 'bg-amber-100 text-amber-700',
  '비즈니스·전략': 'bg-orange-100 text-orange-700',
};

export function StageCard({ stage, filter }: { stage: Stage; filter: PathFilter }) {
  const t = useT();
  return (
    <div className="space-card rounded-xl border border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-700 p-5 shadow-xs">
      <header className="mb-4 flex items-center gap-3">
        <StageSymbol kind={stage.id} />
        <div>
          <h2 className="font-semibold text-stone-800 dark:text-stone-200">{t('pathStage.' + stage.id + '.title')}</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">{t('pathStage.' + stage.id + '.sub')}</p>
        </div>
      </header>

      <ul className="grid gap-2.5 text-sm">
        {stage.items.map((it) => {
          // 난이도/분야 필터에 맞지 않으면 목록에서 제외
          const hidden =
            (filter.level && it.level !== filter.level) ||
            (filter.category && it.category !== filter.category);
          if (hidden) return null;

          const cert = getCert(it.refId);
          const refLabel = cert?.name;
          // 동일한 텍스트(예: "Hugging Face LLM Course") 중복 표시 억제
          const showRef = !!refLabel && refLabel !== it.label;
          return (
            <li
              key={it.id}
              className="flex flex-col items-start justify-between gap-3 rounded-lg border border-stone-200 p-2.5 dark:border-stone-700 sm:flex-row sm:items-center"
            >
              <div className="flex flex-col">
                <span className="font-medium text-stone-800 dark:text-stone-200">{it.label}</span>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${levelColor[it.level]}`}
                    title="난이도"
                  >
                    {t('level.' + it.level)}
                  </span>
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${categoryColor[it.category]}`}
                    title="분야"
                  >
                    {t('pathCategory.' + it.category)}
                  </span>
                  {showRef && (
                    <span className="line-clamp-1 text-xs text-stone-500">
                      {refLabel}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="flex items-center gap-1" title={it.estMin === null ? '제공처가 고정 시간을 안내하지 않은 자율 학습 과정입니다.' : '학습 계획용 예상 시간입니다. 실제 소요 시간은 공식 페이지를 확인하세요.'}>
                  <ClockIcon className="h-3 w-3" /> {it.estMin === null ? '자율 학습' : <>약 {it.estMin}{t('ui.min')}</>}
                </span>
                {it.kind === 'cert' && qualifications.some((item) => item.id === it.refId) ? (
                  <Link to={`/qualifications?exam=${encodeURIComponent(it.refId)}`} className="inline-flex min-h-9 items-center gap-1 rounded px-2 text-stone-500 hover:bg-stone-100" aria-label={`${it.label} 자격증 상세 보기`}>자격 상세 <ExternalLinkIcon className="h-4 w-4" /></Link>
                ) : cert?.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-1 rounded px-2 text-stone-500 hover:bg-stone-100 hover:text-amber-600 dark:text-stone-300 dark:hover:bg-stone-700"
                    title="공식 페이지 열기"
                    aria-label={`${it.label} 공식 페이지 (새 탭)`}
                  >
                    공식 자료 <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
