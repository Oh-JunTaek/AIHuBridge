# 자격관 확장과 수료관 구분

- 기존 `/qualifications`을 자격관으로 바꾸고 컴퓨터활용능력 1·2급, 정보기술자격(ITQ), 워드프로세서, 정보처리기사를 추가했다. 기존 주소와 자격 상세 링크를 유지한다.
- 시험 운영기관의 종목 안내에서 분류·과목·응시자격·응시료를 확인했다. 자격 유효기간과 개별 시험 예약 등 확인하지 못한 조건은 공식 안내 확인으로 남겼다. 정보처리기사는 기사 응시자격 심사가 필요하다.
- 기존 `/certs`를 수료관으로 바꾸고 개별 과정의 수료증 제공이 공식 페이지에서 확인된 AI Prompting for Everyone, Hugging Face Agents Course, Google AI Essentials, AI For Everyone 4개 과정만 노출한다. 기존 데이터의 다른 과정과 역량 배지는 삭제하지 않았다. 수료증 발급 여부나 조건이 불분명한 항목은 재검토 후 자료실 개편에 사용할 예정이다.
- 공식 근거: [대한상공회의소 컴퓨터활용능력](https://license.korcham.net/co/examguide.do?mm=22), [워드프로세서](https://license.korcham.net/co/examguide.do?cd=0102&mm=22), [KPC ITQ](https://license.kpc.or.kr/nasec/qlfint/qlfint/selectItqinfotchnlgyqc.do?pageKind=announcement), [Q-Net 정보처리기사](https://www.q-net.or.kr/crf005.do?id=crf00503s02&jmCd=1320), [DeepLearning.AI 과정](https://www.deeplearning.ai/courses/ai-prompting-for-everyone/), [Hugging Face 과정](https://huggingface.co/learn/agents-course/en/unit0/introduction), [Google 과정](https://grow.google/intl/ko_kr/ai-essentials/), [Coursera 과정](https://www.coursera.org/learn/ai-for-everyone).
- 검증: `npm test` 90개, `npm run lint`, `npm run selfcheck`, `npm run build`, `git diff --check` 통과. 빌드에 Tailwind 소스맵 경고가 있었다. 브라우저에서 로컬 서버 연결이 시간 초과되어 화면 조작과 실기기 검증은 수행하지 못했다.
- 자료실 및 실습의 메뉴 구성, OpenAI·Claude 아카데미, 주제별 추천 커리큘럼은 이번에 구현하지 않았다. 캘린더 연동은 취소된 범위를 유지한다.
