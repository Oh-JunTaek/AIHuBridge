import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-slate-700">
        페이지를 찾을 수 없어요. (AI가 아니라 라우터가 못 찾았을 뿐이에요 😄)
      </p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        브리핑으로 돌아가기
      </Link>
    </div>
  );
}
