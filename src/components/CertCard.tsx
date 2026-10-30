import { WayfindingIcon } from './WayfindingIcon';
import type { Certification } from '../types';
import { feeLabel } from '../lib/cert-rules.mjs';
import { useT } from '../lib/i18n';

export function CertCard({ c }: { c: Certification }) {
  const t = useT();
  return (
    <div className="space-card rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-xs">
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
          {t('certs.tab.' + c.type)}
        </span>
      </div>

      <h3 className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{c.name}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{c.provider}</p>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
        <span>{c.difficulty}</span>
        {c.validity && <span>유효기간: {c.validity}</span>}
        <span>{c.language === 'ko' ? '한국어' : c.language === 'both' ? '한국어·영어' : c.language === 'en' ? '영어' : '언어 미확인'}</span>
      </div>

      <dl className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
        <div><dt className="font-semibold">학습·준비 비용 · {feeLabel(c.learningFee)}</dt><dd className="mt-1 leading-relaxed">{c.learningFee.note}</dd></div>
        <div><dt className="font-semibold">{c.type === 'exam' ? '시험·응시 비용' : '수료증·평가 비용'} · {feeLabel(c.credentialFee)}</dt><dd className="mt-1 leading-relaxed">{c.credentialFee.note}</dd></div>
        <div><dt className="font-semibold">참여·수료 조건</dt><dd className="mt-1 leading-relaxed">{c.requirements}</dd></div>
      </dl>
      {c.availableUntil && <p className="mt-3 text-xs font-medium text-amber-700 dark:text-amber-300">수강·학습 종료: {c.availableUntil} (제공처 기준 날짜)</p>}
      {c.note && <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{c.note}</p>}
      <details className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        <summary className="cursor-pointer py-2">검토일 {c.verifiedAt} · 근거 보기</summary>
        <ul className="mt-1 grid gap-1">{c.evidenceUrls.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="inline-block py-2 underline">공식 근거 {index + 1} <WayfindingIcon direction="external" /></a></li>)}</ul>
      </details>
      <div className="mt-3 flex justify-end">
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${c.name} 공식 페이지 (새 탭)`}
          className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
        >
          {t('certs.official')}
        </a>
      </div>

    </div>
  );
}
