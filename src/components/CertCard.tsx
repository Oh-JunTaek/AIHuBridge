import type { Certification } from '../types';
import { feeLabel } from '../lib/cert-rules.mjs';
import { LearningVisual } from './LearningVisual';
import { WayfindingIcon } from './WayfindingIcon';

const languageLabel = (c: Certification) => c.language === 'ko' ? '한국어' : c.language === 'both' ? '한국어·영어' : c.language === 'en' ? '영어' : '언어 미확인';

export function CertCard({ c, onOpen }: { c: Certification; onOpen: () => void }) {
  return <button type="button" className="learning-list-card" onClick={onOpen}>
    <span className="learning-list-main">
      <span className="learning-list-heading"><strong>{c.name}</strong><span className="learning-list-tag">수료 과정</span></span>
      <span className="learning-list-description">{c.note || c.requirements}</span>
      <span className="learning-list-meta">{c.provider} · {c.difficulty} · {languageLabel(c)}</span>
    </span>
    <LearningVisual kind="certificate" />
    <span className="learning-list-arrow" aria-hidden="true"><WayfindingIcon /></span>
  </button>;
}

export function CertDetail({ c }: { c: Certification }) {
  return <>
    <p className="qualification-dialog-intro">{c.provider} · {c.difficulty} · {languageLabel(c)}{c.validity ? ` · 유효기간: ${c.validity}` : ''}</p>
    <dl className="qualification-details">
      <div><dt>학습·준비 비용 · {feeLabel(c.learningFee)}</dt><dd>{c.learningFee.note}</dd></div>
      <div><dt>수료증·평가 비용 · {feeLabel(c.credentialFee)}</dt><dd>{c.credentialFee.note}</dd></div>
      <div><dt>참여·수료 조건</dt><dd>{c.requirements}</dd></div>
      {c.availableUntil && <div><dt>수강·학습 종료</dt><dd>{c.availableUntil} (제공처 기준 날짜)</dd></div>}
    </dl>
    {c.note && <p className="qualification-dialog-intro">{c.note}</p>}
    <p className="qualification-evidence">검토일 {c.verifiedAt} · 비용과 조건은 공식 페이지에서 확인하세요.</p>
    <a href={c.url} target="_blank" rel="noopener noreferrer" className="qualification-official" aria-label={`${c.name} 공식 페이지 (새 탭)`}>공식 페이지 <WayfindingIcon direction="external" /></a>
    <details className="mt-4 text-xs text-slate-500"><summary className="cursor-pointer py-2">공식 근거 보기</summary><ul className="mt-1 grid gap-1">{c.evidenceUrls.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="inline-block py-2 underline">공식 근거 {index + 1} <WayfindingIcon direction="external" /></a></li>)}</ul></details>
  </>;
}
