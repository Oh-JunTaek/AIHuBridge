# 코드와 외부 자료의 권리·재사용 안내

기준일: 2026-10-29. 기존 package.json·약관의 MIT 선언과 ‘코드 MIT / 외부 콘텐츠 권리 구분’ 사용자 결정을 구체화한다.

| 대상 | 기준과 확인 위치 |
|---|---|
| 이 프로젝트가 작성한 코드·관련 문서 | 루트 [LICENSE](../../LICENSE)의 MIT 원문. 재배포 시 저작권·허가 고지 보존 |
| 뉴스·공식 발표·논문·교육·행사 자료 | 해당 제공처의 조건. [출처 관리표](./SOURCE_REGISTRY.md)와 각 항목의 원문·근거 링크 확인 |
| 외부 상표·이미지·로고 | 각 권리자의 조건. 저장소에 포함됐다는 이유로 MIT 재사용 허가를 부여하지 않음 |
| 외부 소프트웨어 패키지 | 각 패키지에 동봉된 LICENSE·NOTICE 등. package-lock.json은 사용 버전 확인용이며 권리 고지를 대체하지 않음 |
| 대한민국 경계 자료 | Natural Earth 공개 도메인. scripts/data/korea-boundary.json의 원본·이용 조건과 출처 관리표 참조 |

자격증 카드의 로컬 시안은 [한국데이터산업진흥원](https://www.kdata.or.kr/kr/contents/ci/view.do), [한국생산성본부](https://www.kpc.or.kr/kpc/PTWHP005_about_008.do), [대한상공회의소](https://seoulcci.korcham.net/nCham/Service/Kcci/appl/Ci.asp), [한국산업인력공단](https://chungnam.hrdkorea.or.kr/3/2/2/1)의 공식 이미지를 사용한다. 공개 배포 전 주관기관 식별 용도와 투명도 적용의 이용 조건을 확인한다. 다운로드 제공 자체를 재사용 허가로 간주하지 않는다.

사용자가 제공한 AICE 로고도 로컬 시안에 포함한다. 로고 원본에 대한 사용 허락과 투명도 적용 가능 여부는 공개 배포 전에 확인한다.

AWS는 [상표 지침](https://aws.amazon.com/trademark-guidelines/)에서 제3자의 사실 설명을 텍스트로 안내하고 로고는 별도로 제한한다. Microsoft의 [콘텐츠 사용 안내](https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/permissions)는 보도용 이미지를 언론·산업 분석가의 편집 목적으로 구분하고 로고는 상표 지침을 따르게 한다. Google도 [브랜드 사용 지침](https://about.google/brand-resource-center/guidance/)에서 사용 맥락을 구분한다. AWS·Microsoft·Google Cloud·ISC2·NVIDIA의 로고는 자격 목록 카드에서의 허용 여부를 확인한 뒤 적용한다.

외부 본문·영상·교안·이미지의 포괄적인 재배포 허가를 주장하지 않는다. 기존 공고·출처에 별도 이용허락 표시가 있으면 그 조건을 확인한다. 이 작업은 모든 외부 의존성의 라이선스를 전수 감사하거나 외부 저작물의 권리 관계를 확정한 것이 아니다.

## 원문 관리

- MIT 원문은 [Open Source Initiative](https://opensource.org/license/mit)의 표준 본문을 따른다. 영어 표준 본문과 기술 식별자는 보존하고, 한국어 안내로 대체하지 않는다.
- 루트 LICENSE 한 파일을 정본으로 사용한다. postbuild가 이를 dist/LICENSE.txt로 복사하고, 약관은 BASE_URL 아래 LICENSE.txt를 새 탭으로 연다. 브라우저에서 텍스트로 열도록 배포 사본에는 .txt 확장자를 사용한다. 별도 사본을 손으로 수정하지 않는다.
- 저작권 고지는 프로젝트 기여자(AI HuBridge contributors)로 표기한다. 외부 제공처 콘텐츠나 의존성의 권리를 프로젝트에 이전한다는 뜻이 아니다.
- 코드·외부 자료의 적용 범위 변경은 이 문서·LICENSE·package.json·약관·README를 대조한다. 원격 반영 여부는 PLAN과 해당 결과 문서를 확인한다.
