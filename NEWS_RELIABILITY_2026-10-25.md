# 뉴스 탐색·수집 안정화와 투명 로고 작업 결과

기준일: 2026-10-25. 이 문서는 작업 이력이며 현재 작업 지시는 AGENTS.md, PLAN.md, AUTOMATION.md를 따른다.

## 범위

개인화 없는 예정 작업 가운데 뉴스 출처 설정 단일화·발행일 검증·부분 실패 보존·중복 개선과 언어 탐색을 구현했다. 사용자 추가 요청에 따라 흰 배경이 있던 헤더 로고를 투명 이미지로 교체했다. 인증기관 비용 재검증과 국내 행사 출처 추가는 이번 범위에 포함하지 않았다.

## 뉴스 수집 계약

- 유일한 출처 목록: src/lib/news-sources.mjs. src/lib/config.ts와 scripts/lib/news-collector.mjs가 함께 사용한다. 기존 수집 출처 6곳을 유지하고, 화면 설정에만 있던 Google AI Blog 불일치를 제거했다.
- RSS 전체 항목을 검증한 뒤 출처별 최신 8건을 고른다. 전체 상한은 현재 6곳 기준 48건이다. 정상 출처가 직접 제공하는 오래된 기사는 허용한다.
- 발행일은 isoDate 또는 pubDate로 확인한다. 누락·무효·수집 시각보다 5분 넘게 미래인 날짜를 수집 시각으로 채우지 않고 제외한다. 비어 있지 않은 RSS의 유효 기사가 0건이면 해당 출처 실패로 처리한다.
- 정상 RSS의 빈 배열은 성공 0건이다. 실패와 구분하며 그 출처의 이전 기사를 다시 채우지 않는다. 전체 출처 실패 또는 최종 전체 0건은 파일을 교체하지 않고 실패한다.
- 일부 출처 실패 시 해당 출처의 기존 스키마가 유효하고 발행 후 7일 이내인 기사만 최대 8건 보존한다. 재실행으로 발행일이나 보존 기간을 연장하지 않는다. 마지막 출처 성공 시각은 유지하며 이전 메타에 없으면 null로 남긴다.
- 제목의 구분자와 언론사 접미사를 임의로 삭제하지 않는다. 평문 RSS 설명만 제한 길이로 발췌한다. 설명이 없으면 제목만 제공한다. 한국 Google 뉴스의 제목을 설명으로 중복 표시하지 않는다.
- HTTP(S) 원문 URL에서 fragment와 utm_*, fbclid, gclid만 제거한다. 다른 쿼리는 유지한다. 동일 URL만 중복 제거하고 제목이 같은 다른 URL은 남긴다. 실패 출처의 이전 기사보다 새 수집 기사를 우선한다. URL을 기준으로 안정적인 ID를 만든다.
- 메타: status(success/partial), sourceResults(출처별 성공·실패, 신규 count, 제외 rejected, 보존 retained, lastSuccessAt), 최종 counts, unavailableSources. 전체 fetchedAt은 실행 시각이며 각 출처 성공 시각과 구분한다. 화면에서 부분 실패와 36시간 경고를 함께 표시한다.

## 탐색 화면

분야·기사 언어·출처·검색어를 함께 적용한다. 검색은 제목·출처·평문 설명·태그를 대상으로 하며 공백으로 나눈 모든 단어를 포함하는 기사를 찾는다. 결과 건수, 빈 결과, 조건 초기화를 제공한다. 원문을 번역하지 않고 필터를 저장하거나 사용자별 추천에 사용하지 않는다. 남아 있던 홈의 읽음 기록용 빈 콜백도 제거했다.

## 로고

- 원본 public/icon/HuBridge.png는 RGB 흰 배경, public/icon/LOGO.png는 이미 투명이었다.
- 새 헤더 자산: public/icon/hubridge-transparent.png. 원본은 보존했다. RGBA 2172×724, 실제 알파 0~255와 모서리 완전 투명을 확인했다.
- 라이트: 기존 컬러. 다크: CSS brightness-0/invert로 밝은 단색을 적용해 어두운 글자 대비를 확보했다. 로고 모양은 같은 이미지이며 테마별 배경 판을 추가하지 않았다.
- 편집 도구: 내장 image_gen, imagegen 스킬, transparent_background=true. 별도 키·외부 서비스 계정을 사용하지 않았다.
- 최종 편집 프롬프트:

> Use case: background-extraction. Edit target: existing horizontal AI HuBridge website logo. Remove ONLY the off-white background to genuine alpha transparency, including inside letter counters and between all strokes. Preserve the existing cyan/blue/purple AI bridge symbol, navy HuBridge wordmark, exact text 'HuBridge', geometry, horizontal arrangement, gradients and original proportions. No redesign, no added content, no new background, no checkerboard baked into pixels. Clean antialiased edges with no white matte halo. Intended for light and dark website headers. Return transparent PNG.

## 검증

- 실제 RSS 실행: 2026-10-25 한국시간 21:46, 40건, 전체 성공. arXiv는 정상 0건이었으며 실패로 분류하지 않았다. 건수는 실행마다 달라질 수 있다.
- 회귀 검사 48건, 타입·selfcheck·프로덕션 빌드 통과. 기존 Tailwind sourcemap 경고는 남아 있다.
- 개발 서버: npm run dev 실행 및 브라우저 표시 확인.
- 브라우저: 한국어+한국 Google 뉴스 8건 → NVIDIA 검색 1건 → 없는 검색어 0건 → 조건 초기화 40건. 라이트 컬러 로고와 다크 단색 로고에 흰 배경 사각형이 없음을 확인했다.
- 시각 증거: artifacts/news-dark-preview.png.
- 워크플로 트리거·예약·권한은 변경하지 않았다. 운영 반영은 커밋의 Pages 배포 성공 여부로 별도 확인한다.
