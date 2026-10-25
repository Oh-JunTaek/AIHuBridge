/**
 * 이용약관 페이지
 * - 서비스 이용 전 필수 동의
 * - 개발사: EunmaStudio
 */
export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-stone-600 dark:text-stone-300">
      <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
        이용약관
      </h1>

      <section className="space-y-6">
        <div>
          <h2 className="font-semibold text-stone-700 dark:text-stone-200">1. 서비스 이용허가</h2>
          <p className="mt-2">
            AI 허브릿지(이하 "본 서비스")는 개인용 학습 도구이며, 수정용 사용자에 한해 비상업적 이용을 허용합니다.
            상업적 용도로 이용하려면 EunmaStudio에 문의하십시오.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-stone-700 dark:text-stone-200">2. 데이터 처리</h2>
          <p className="mt-2">
            본 서비스는 사용자의 브라우저 로컬 스토리지에만 데이터를 저장하며,
            어떠한 개인정보도 서버로 전송하지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-stone-700 dark:text-stone-200">3. 면책조항</h2>
          <p className="mt-2">
            뉴스 링크 및 인증 페이지는 제3자 콘텐츠로, 본 서비스 운영진은 그 정확성에 대해
            보증하지 않습니다.
          </p>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-700 pt-4 text-xs">
          <p>© {new Date().getFullYear()} AI 허브릿지. Developed by <strong className="text-amber-600">EunmaStudio</strong>.</p>
        </div>
      </section>
    </div>
  );
}