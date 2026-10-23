import { Link } from 'react-router-dom';
import { useT } from '../lib/i18n';

export default function NotFound() {
  const t = useT();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-slate-700">{t('notFound.message')}</p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {t('notFound.back')}
      </Link>
    </div>
  );
}
