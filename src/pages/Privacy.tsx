/** 실제 저장 항목과 외부 서비스 요청 범위를 안내한다. */
export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-stone-600 dark:text-stone-300">
      <h1 className="mb-6 text-2xl font-bold text-stone-800 dark:text-stone-100">개인정보 및 저장 정보 안내</h1>
      <p className="mb-6 text-xs">적용일: 2026년 10월 25일</p>
      <div className="space-y-6">
        <section>
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">1. 서비스가 저장하는 항목</h2>
          <p className="mt-2">본 서비스는 로그인·회원가입·개인 학습 기록 기능을 제공하지 않습니다. 현재 화면 설정이나 개인 기록을 브라우저에 저장하지 않습니다. 이전 버전의 저장값은 읽거나 사용하지 않으며, 브라우저의 사이트 데이터 삭제 기능으로 지울 수 있습니다.</p>
        </section>
        <section>
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">2. 웹사이트 접속과 외부 요청</h2>
          <p className="mt-2">사이트 자체의 분석·광고 추적 코드는 사용하지 않습니다. 웹사이트는 GitHub Pages에서 제공하며 GitHub는 보안 목적으로 접속자의 IP 주소를 기록합니다. 글꼴 리소스 요청은 Google Fonts에 연결될 수 있습니다. 원문·신청 링크를 열면 해당 제공처의 서비스와 정책이 적용됩니다.</p>
          <p className="mt-2">기업 SNS 화면을 열면 공개 게시물을 불러오기 위해 브라우저가 Bluesky API에 직접 요청하므로 접속자의 IP 등 네트워크 정보가 Bluesky에 전달될 수 있습니다. 게시물과 검색 조건은 서비스가 저장하지 않습니다. <a href="https://bsky.social/about/support/network-services-privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Bluesky 개인정보 안내</a></p>
          <p className="mt-2 space-x-3"><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" className="underline">GitHub 개인정보 정책</a><a href="https://developers.google.com/fonts/faq/privacy" target="_blank" rel="noopener noreferrer" className="underline">Google Fonts 개인정보 안내</a></p>
        </section>
        <section>
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">3. 수집 콘텐츠</h2>
          <p className="mt-2">AI 소식과 AI 일정은 운영 작업에서 수집한 정적 자료를 제공합니다. 탐색 조건은 브라우저에 저장하거나 제공처로 전송하지 않습니다.</p>
        </section>
        <section><h2 className="font-semibold text-stone-800 dark:text-stone-100">4. 운영 주체</h2><p className="mt-2">서비스 운영 및 정보 정정: eunmastudio · <a href="mailto:eunmastudio@gmail.com" className="underline">eunmastudio@gmail.com</a></p></section>
      </div>
    </div>
  );
}
