# 홈·대시보드·메뉴 개선 (2026-10-29)

- 상위 메뉴의 화살표를 없애고 마우스 진입 시 메뉴를 열도록 변경했다. 클릭·터치·키보드 버튼, 포커스 이동과 Escape 동작은 유지하도록 구현했다. 하위 메뉴에 짧은 진입 움직임을 적용하고 움직임 줄이기 설정을 따른다.
- 홈의 네 전시물을 자체 CSS 그래픽으로 변경했다. AI 소식의 기업명은 텍스트로만 표시하고 실제 기업 로고나 제휴를 의미하지 않는다. 일정표, 강의 장면, 인증서는 해당 기능을 상징한다. 호버·포커스 반응을 적용했다.
- 대시보드에 정보관 공간 스타일, 빠른 이동과 최근 소식 구성을 적용했다. 로딩·오류·빈 상태, 최근 7일 최대 6개, 소식 원문 링크를 유지했다. 탐색 패널의 글자 크기·줄바꿈을 조정했다.
- 무료 글꼴 후보: [Pretendard](https://github.com/orioncactus/pretendard/blob/main/packages/pretendard/docs/en/README.md), [Spoqa Han Sans Neo](https://spoqa.github.io/spoqa-han-sans/), [Noto Sans KR](https://notofonts.github.io/noto-docs/website/use/) 모두 배포처에서 OFL을 명시한다. 본문 사용감은 적용 비교가 필요하다. 현재 Pretendard는 CSS 글꼴 목록에만 있고 폰트 파일을 제공하지 않으므로 기기별 대체 글꼴이 쓰일 수 있다. 이번에는 글꼴 파일·외부 CDN을 추가하지 않았다.
- 데스크톱 홈·대시보드, 320px 홈·대시보드, 다크 대시보드, 메뉴 클릭·Escape를 로컬 브라우저에서 확인했다. 마우스 진입·터치·스크린리더와 움직임 감소 모드는 별도 실제 상호작용 검증이 필요하다. 테스트 90개, lint, selfcheck, build 통과. Tailwind 소스맵 경고가 있다. 원격 전송은 하지 않았다.
