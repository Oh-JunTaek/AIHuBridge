/**
 * 개인정보 처리방침 페이지
 * - 로컬 저장 기반 → 개인정보 미전송
 * - 제작사: EunmaStudio
 */
export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-stone-600 dark:text-stone-300">
      <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
        개인정보 처리방침
      </h1>

      <section className="space-y-6">
        <div>
          <h2 className="font-semibold text-stone-700 dark:text-stone-200">1. 정보 수집</h2>
          <p className="mt-2">
            본 서비스는 **어떠한 개인정보도 수집하지 않습니다**.
            사용자님의 학습 진도, 설정, 퀴즈 기록 등은 모두 브라우저의 로컬 스토리지에 저장되며,
            서버로 전송되지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-stone-700 dark:text-stone-200">2. 쿠키 및 추적</h2>
          <p className="mt-2">
            본 서비스는 분석 추적(Cookie/Analytics) 코드를 사용하지 않습니다.
            오직 브랜드 표시(`HuBridge.png`)를 제외한 모든 리소스는 로컬에서 처리됩니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-stone-700 dark:text-stone-200">3. 문의처</h2>
          <p className="mt-2">
            서비스 관련 문의: <strong className="text-amber-600">EunmaStudio</strong>
          </p>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-700 pt-4 text-xs">
          <p>© {new Date().getFullYear()} AI 허브릿지. Developed by <strong className="text-amber-600">EunmaStudio</strong>.</p>
        </div>
      </section>
    </div>
  );
}