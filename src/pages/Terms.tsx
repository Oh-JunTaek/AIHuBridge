/** 공개 정보 서비스의 이용 범위와 콘텐츠 출처를 안내한다. */
export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-sm text-stone-600 dark:text-stone-300">
      <h1 className="mb-6 text-2xl font-bold text-stone-800 dark:text-stone-100">이용안내 및 약관</h1>
      <p className="mb-6 text-xs">적용일: 2026년 10월 29일</p>
      <div className="space-y-6">
        <section>
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">1. 공개 정보 서비스</h2>
          <p className="mt-2">AI 허브릿지는 누구나 로그인 없이 AI 소식·교육·인증 정보와 AI 일정을 열람할 수 있는 공개 웹 서비스입니다. 서비스는 개인별 학습 기록이나 공식 인증 발급을 제공하지 않습니다.</p>
        </section>
        <section>
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">2. 코드와 외부 콘텐츠의 권리</h2>
          <p className="mt-2">본 프로젝트가 작성한 소스 코드에는 저장소에 표기된 MIT 라이선스를 적용합니다. 외부 뉴스·강의·행사·기관의 콘텐츠와 상표·이미지는 각 권리자에게 권리가 있으며 코드 라이선스가 이 자료의 재사용 허가를 의미하지 않습니다. 원문 자료를 이용하거나 재배포할 때는 해당 제공처의 조건을 확인해야 합니다.</p>
          <p className="mt-2">사용한 외부 소프트웨어 패키지에도 각 패키지의 라이선스가 별도로 적용됩니다.</p>
          <a href={`${import.meta.env.BASE_URL}LICENSE.txt`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline">코드 MIT 라이선스 원문 보기 (새 탭)</a>
        </section>
        <section>
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">3. 신청과 정보 확인</h2>
          <p className="mt-2">수강·응시·행사 신청은 연결된 제공처에서 진행합니다. 일정·모집 상태·가격·수료 조건은 변경될 수 있으므로 신청 전에 원문을 확인해 주세요. 신청 마감이 미확인인 행사는 모집 중으로 보장하지 않습니다.</p>
        </section>
        <section>
          <h2 className="font-semibold text-stone-800 dark:text-stone-100">4. 화면 설정과 문의</h2>
          <p className="mt-2">테마 설정은 이 브라우저에만 저장되며 기기 간 동기화되지 않습니다. 서비스 관련 문의 및 정보 정정 요청의 운영 주체는 eunmastudio입니다. 공개 문의 주소는 추후 추가 예정입니다.</p>
        </section>
      </div>
    </div>
  );
}
