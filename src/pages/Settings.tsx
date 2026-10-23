import { useUser } from '../lib/user';
import { useT, THEMES, LANGUAGES, type Lang, type Theme } from '../lib/i18n';

export default function Settings() {
  const { state, mutate } = useUser();
  const t = useT();

  const pickTheme = (theme: Theme) => mutate({ theme });
  const pickLang = (lang: Lang) => mutate({ lang });

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

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-stone-600">{t('settings.language')}</h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lg) => (
            <button
              key={lg.value}
              onClick={() => pickLang(lg.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                state.lang === lg.value
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {lg.label[state.lang ?? 'ko']}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-stone-400">
          {t('settings.saved')} · {state.lang === 'ko' ? '한국어' : 'English'}
        </p>
      </section>

      <p className="mt-8 text-xs text-stone-400">
        설정은 브라우저(localStorage)에 저장됩니다. 다른 브라우저에서는 초기화됩니다.
      </p>
    </div>
  );
}
