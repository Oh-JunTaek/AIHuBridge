import { useUser } from '../lib/user';
import { useT, THEMES, type Theme } from '../lib/i18n';

export default function Settings() {
  const { state, mutate } = useUser();
  const t = useT();

  const pickTheme = (theme: Theme) => mutate({ theme });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold text-stone-800">{t('settings.title')}</h1>
      <p className="mt-1 text-sm text-stone-500">{t('settings.themeHint')}</p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-stone-600">{t('settings.theme')}</h2>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((th) => (
            <button
              key={th}
              onClick={() => pickTheme(th)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                state.theme === th
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t('settings.' + th)}
            </button>
          ))}
        </div>
      </section>

      {/* 언어 설정 제거 (한국어 전용) */}
      <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
        🌐 현재 언어: 한국어 (Language setting is not available.)
      </p>

      <p className="mt-8 text-xs text-stone-400">
        설정은 브라우저(localStorage)에 저장됩니다. 다른 브라우저에서는 초기화됩니다.
      </p>
    </div>
  );
}
