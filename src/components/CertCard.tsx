import type { Certification } from '../types';
import { costLabel } from '../lib/certs';
import { CheckIcon, ClockIcon } from './icons';

export function CertCard({ c, checked, onToggle }: { c: Certification; checked: boolean; onToggle: () => void }) {
  const costFree = c.costUSD === 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            c.type === 'exam'
              ? 'bg-indigo-100 text-indigo-800'
              : c.type === 'micro'
                ? 'bg-cyan-100 text-cyan-800'
                : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {c.type === 'exam' ? '시험' : c.type === 'micro' ? '스킬배지' : '과정'}
        </span>
        <button
          className={`rounded-full p-1 ${
            checked ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
          }`}
          title={checked ? '완료 체크됨' : '완료로 표시'}
          onClick={onToggle}
        >
          <CheckIcon className="h-4 w-4" />
        </button>
      </div>

      <h3 className="mt-2 text-sm font-semibold text-slate-800">{c.name}</h3>
      <p className="mt-1 text-xs text-slate-500">{c.provider}</p>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
        <span>{c.difficulty}</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" /> {c.validity || '—'}
        </span>
        <span>{c.language === 'ko' ? '🇰🇷 한국어' : c.language === 'both' ? '🈶 KR/EN' : '🇬🇧 EN'}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-700">
          {costFree ? '무료' : costLabel(c)}
        </span>
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
        >
          공식 페이지
        </a>
      </div>
      {checked && (
        <span className="mt-2 block text-[10px] text-emerald-600">✓ 체크 완료</span>
      )}
    </div>
  );
}
