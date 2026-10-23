import { useState } from 'react';
import { certsByType } from '../lib/certs';
import { CertCard } from '../components/CertCard';
import { useUser } from '../lib/user';
import { useT } from '../lib/i18n';
import type { CertType } from '../types';
import { Link } from 'react-router-dom';

export default function Certs() {
  const { state, mutate } = useUser();
  const t = useT();
  const [tab, setTab] = useState<CertType>('course');
  const groups = certsByType();

  const toggleCheck = (id: string) => {
    const next = state.earnedCertChecks.includes(id)
      ? state.earnedCertChecks.filter((x) => x !== id)
      : [...state.earnedCertChecks, id];
    mutate({ earnedCertChecks: next });
  };

  const tabs: { id: CertType; label: string; emoji: string }[] = [
    { id: 'course', label: '무료 과정', emoji: '📚' },
    { id: 'exam', label: '수험 인증', emoji: '🎯' },
    { id: 'micro', label: '스킬 배지', emoji: '🎖️' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-slate-800">{t('certs.title')}</h1>
        <Link to="/path" className="text-xs underline">
          {t('certs.back')}
        </Link>
      </header>

      <nav className="mb-4 flex gap-2 text-sm">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium ${
              tab === tb.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tb.emoji} {t('certs.tab.' + tb.id)}</span>
          </button>
        ))}
      </nav>

      <p className="mb-4 text-xs text-slate-500">{t('certs.note')}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {groups[tab].map((c) => (
          <CertCard
            key={c.id}
            c={c}
            checked={state.earnedCertChecks.includes(c.id)}
            onToggle={() => toggleCheck(c.id)}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">{t('certs.footer')}</p>
    </div>
  );
}
