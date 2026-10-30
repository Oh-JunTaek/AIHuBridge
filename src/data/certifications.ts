import type { Certification } from '../types';

// 비용·수료·선행 요건은 정적 검토 자료다. 근거 URL과 검토일을 함께 유지한다.
export const certifications: Certification[] = [
  {
    "id": "boost-ai-basics",
    "name": "모두를 위한 인공지능 기초",
    "provider": "네이버 커넥트재단 · 부스트코스",
    "type": "course",
    "language": "ko",
    "difficulty": "초급",
    "url": "https://www.boostcourse.org/ai102",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "부스트코스 무료 공개 강의. 상시 수강·자율 학습 과정입니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "온라인 수료증 발급 안내는 있으나 별도 발급 요금·세부 수료 기준은 확인하지 못했습니다. 원문에서 확인하세요."
    },
    "requirements": "AI 개념을 처음 접하는 입문자를 위한 출발점입니다. 수강 등록·이수 조건은 제공처에서 확인하세요.",
    "note": "AI가 낯설다면 개념부터 살펴보는 기초 강의입니다.",
    "evidenceUrls": [
      "https://www.boostcourse.org/ai102",
      "https://www.boostcourse.org/opencourse"
    ]
  },
  {
    "id": "boost-python-everybody",
    "name": "모두를 위한 프로그래밍 : 파이썬",
    "provider": "네이버 커넥트재단 · 부스트코스",
    "type": "course",
    "language": "both",
    "difficulty": "초급",
    "url": "https://www.boostcourse.org/pythonforeverybody",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "부스트코스 무료 공개 강의. 상시 수강·자율 학습 과정입니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "온라인 수료증 발급 안내는 있으나 별도 발급 요금·세부 수료 기준은 확인하지 못했습니다. 원문에서 확인하세요."
    },
    "requirements": "프로그래밍 입문용 강의입니다. 실습 환경과 수료 기준은 공식 학습 안내를 확인하세요.",
    "note": "Python for Everybody를 한국어로 번역하여 제공하는 과정입니다.",
    "evidenceUrls": [
      "https://www.boostcourse.org/pythonforeverybody",
      "https://www.boostcourse.org/opencourse"
    ]
  },
  {
    "id": "boost-ai-linear-algebra",
    "name": "인공지능을 위한 선형대수",
    "provider": "네이버 커넥트재단 · 부스트코스",
    "type": "course",
    "language": "ko",
    "difficulty": "초급",
    "url": "https://www.boostcourse.org/ai251",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "부스트코스 무료 공개 강의. 상시 수강·자율 학습 과정입니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "온라인 수료증 발급 안내는 있으나 별도 발급 요금·세부 수료 기준은 확인하지 못했습니다. 원문에서 확인하세요."
    },
    "requirements": "권장 순서: AI 개념을 살펴본 뒤 벡터·행렬 등 수학 기초를 학습하세요.",
    "note": "벡터·선형시스템·고유값 등 AI 학습에 필요한 선형대수 기초를 다룹니다.",
    "evidenceUrls": [
      "https://www.boostcourse.org/ai251",
      "https://www.boostcourse.org/opencourse"
    ]
  },
  {
    "id": "boost-data-science",
    "name": "파이썬으로 시작하는 데이터 사이언스",
    "provider": "네이버 커넥트재단 · 부스트코스",
    "type": "course",
    "language": "ko",
    "difficulty": "초급",
    "url": "https://www.boostcourse.org/ds112",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "부스트코스 무료 공개 강의. 상시 수강·자율 학습 과정입니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "온라인 수료증 발급 안내는 있으나 별도 발급 요금·세부 수료 기준은 확인하지 못했습니다. 원문에서 확인하세요."
    },
    "requirements": "권장 순서: 파이썬 기초 이후 데이터 분석 입문으로 연결하세요.",
    "note": "파이썬으로 데이터를 다루고 분석·시각화의 기초를 학습하는 과정입니다.",
    "evidenceUrls": [
      "https://www.boostcourse.org/ds112",
      "https://www.boostcourse.org/opencourse"
    ]
  },
  {
    "id": "boost-ml-python",
    "name": "머신러닝을 위한 파이썬",
    "provider": "네이버 커넥트재단 · 부스트코스",
    "type": "course",
    "language": "ko",
    "difficulty": "중급",
    "url": "https://www.boostcourse.org/ai222",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "부스트코스 무료 공개 강의. 상시 수강·자율 학습 과정입니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "온라인 수료증 발급 안내는 있으나 별도 발급 요금·세부 수료 기준은 확인하지 못했습니다. 원문에서 확인하세요."
    },
    "requirements": "권장 순서: 파이썬 입문을 마친 뒤 머신러닝에 필요한 프로그래밍 기초를 보완하세요.",
    "note": "파이썬과 데이터 처리에서 머신러닝 학습으로 이어지는 준비 과정입니다.",
    "evidenceUrls": [
      "https://www.boostcourse.org/ai222",
      "https://www.boostcourse.org/opencourse"
    ]
  },
  {
    "id": "boost-pytorch-theory",
    "name": "파이토치로 만드는 딥러닝 이론",
    "provider": "네이버 커넥트재단 · 부스트코스",
    "type": "course",
    "language": "ko",
    "difficulty": "중급",
    "url": "https://www.boostcourse.org/ai213",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "부스트코스 무료 공개 강의. 상시 수강·자율 학습 과정입니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "온라인 수료증 발급 안내는 있으나 별도 발급 요금·세부 수료 기준은 확인하지 못했습니다. 원문에서 확인하세요."
    },
    "requirements": "권장 순서: 파이썬·선형대수 기초 이후 딥러닝 이론과 프레임워크로 확장하세요.",
    "note": "입문 이후 PyTorch·딥러닝을 더 공부하려는 학습자를 위한 연결 강의입니다.",
    "evidenceUrls": [
      "https://www.boostcourse.org/ai213",
      "https://www.boostcourse.org/opencourse"
    ]
  },
  {
    "id": "boost-ml-coders",
    "name": "프로그래머를 위한 머신러닝",
    "provider": "네이버 커넥트재단 · 부스트코스",
    "type": "course",
    "language": "both",
    "difficulty": "중급",
    "url": "https://www.boostcourse.org/machinelearningforcoders",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "부스트코스 무료 공개 강의. 상시 수강·자율 학습 과정입니다."
    },
    "credentialFee": {
      "status": "not-offered",
      "note": "공식 강좌 개요에서 수료증 미발급으로 안내합니다."
    },
    "requirements": "프로그래밍 경험이 있는 학습자에게 권장합니다. 강의 언어·번역과 실습 환경을 원문에서 확인하세요.",
    "note": "머신러닝 실습으로 확장하는 과정이며 수료증을 발급하지 않습니다.",
    "evidenceUrls": [
      "https://www.boostcourse.org/machinelearningforcoders",
      "https://www.boostcourse.org/opencourse"
    ]
  },
  {
    "id": "skku-ai-math-intro",
    "name": "[K-MOOC] 인공지능 수학 입문",
    "provider": "성균관대학교 · SKKU Online",
    "type": "course",
    "language": "ko",
    "difficulty": "초급",
    "url": "https://online.skku.edu/local/ubonline/view.php?id=285&lang=ko",
    "verifiedAt": "2026-10-26",
    "availableUntil": "2026-12-31",
    "learningFee": {
      "status": "free",
      "note": "공식 강좌 상세의 결제여부가 무료로 표시되어 있습니다. 제공 기간 내 수강 등록이 필요합니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "수료증 제공 표시는 있으나 발급 비용·세부 이수 기준은 별도로 확인해야 합니다."
    },
    "requirements": "제공처 로그인과 수강 등록이 필요합니다. 모집 정원·승인 및 이수 조건을 원문에서 확인하세요.",
    "note": "AI 이해에 필요한 수학을 익히는 한국어 기초 과정입니다. 학습 종료 후에는 공개 교육 목록에서 제외합니다.",
    "evidenceUrls": [
      "https://online.skku.edu/local/ubonline/view.php?id=285&lang=ko"
    ]
  },
  {
    "id": "skku-ai-math-basics",
    "name": "[K-MOOC] 인공지능 수학 기초",
    "provider": "성균관대학교 · SKKU Online",
    "type": "course",
    "language": "ko",
    "difficulty": "초급",
    "url": "https://online.skku.edu/local/ubonline/view.php?id=286&lang=ko",
    "verifiedAt": "2026-10-26",
    "availableUntil": "2026-12-26",
    "learningFee": {
      "status": "free",
      "note": "공식 강좌 상세의 결제여부가 무료로 표시되어 있습니다. 제공 기간 내 수강 등록이 필요합니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "수료증 제공 표시는 있으나 발급 비용·세부 이수 기준은 별도로 확인해야 합니다."
    },
    "requirements": "제공처 로그인과 수강 등록이 필요합니다. 모집 정원·승인 및 이수 조건을 원문에서 확인하세요.",
    "note": "AI 이해에 필요한 수학을 익히는 한국어 기초 과정입니다. 학습 종료 후에는 공개 교육 목록에서 제외합니다.",
    "evidenceUrls": [
      "https://online.skku.edu/local/ubonline/view.php?id=286&lang=ko"
    ]
  },
  {
    "id": "dlai-prompting",
    "completionCertificateVerified": true,
    "name": "AI Prompting for Everyone (Andrew Ng)",
    "provider": "DeepLearning.AI",
    "type": "course",
    "language": "en",
    "difficulty": "초급",
    "url": "https://www.deeplearning.ai/courses/ai-prompting-for-everyone/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "강의 동영상 청강. 평가·실습·프로젝트 도구는 Pro 범위입니다."
    },
    "credentialFee": {
      "status": "paid",
      "note": "수료증은 Pro 구독 및 필수 평가 완료가 필요합니다."
    },
    "requirements": "프로그래밍 선행 지식 없이 시작할 수 있습니다.",
    "evidenceUrls": [
      "https://www.deeplearning.ai/courses/ai-prompting-for-everyone/",
      "https://info.deeplearning.ai/knowledge-base/what-do-i-get-with-the-deeplearning.ai-pro-membership-that-i-dont-get-for-free"
    ],
    "note": "무료 동영상과 유료 수료증을 구분합니다. 공식 안내 기준 약 3시간 4분."
  },
  {
    "id": "dlai-agentic",
    "name": "Agentic AI",
    "provider": "DeepLearning.AI",
    "type": "course",
    "language": "en",
    "difficulty": "중급",
    "url": "https://www.deeplearning.ai/courses/agentic-ai/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "강의 동영상 청강. 평가·실습은 Pro 범위입니다."
    },
    "credentialFee": {
      "status": "paid",
      "note": "수료증은 Pro 구독 및 필수 평가 완료가 필요합니다."
    },
    "requirements": "과정별 Python·LLM 선행 지식은 등록 페이지에서 확인하세요.",
    "evidenceUrls": [
      "https://www.deeplearning.ai/courses/agentic-ai/",
      "https://info.deeplearning.ai/knowledge-base/what-do-i-get-with-the-deeplearning.ai-pro-membership-that-i-dont-get-for-free"
    ],
    "note": "무료 청강이 무료 수료증을 뜻하지 않습니다."
  },
  {
    "id": "dlai-build-with-andrew",
    "name": "Build with Andrew (코딩 없이 앱 만들기)",
    "provider": "DeepLearning.AI",
    "type": "course",
    "language": "en",
    "difficulty": "초급",
    "url": "https://www.deeplearning.ai/courses/build-with-andrew/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "강의 동영상 청강. 평가·프로젝트 도구는 Pro 범위입니다."
    },
    "credentialFee": {
      "status": "paid",
      "note": "수료증은 Pro 구독 및 필수 평가 완료가 필요합니다."
    },
    "requirements": "코딩 경험이 없는 입문자를 대상으로 합니다.",
    "evidenceUrls": [
      "https://www.deeplearning.ai/courses/build-with-andrew/",
      "https://info.deeplearning.ai/knowledge-base/what-do-i-get-with-the-deeplearning.ai-pro-membership-that-i-dont-get-for-free"
    ],
    "note": "공식 과정 표기 약 1시간. 동영상 청강과 수료증 발급을 구분."
  },
  {
    "id": "hf-llm-course",
    "name": "Hugging Face LLM Course",
    "provider": "Hugging Face",
    "type": "course",
    "language": "both",
    "difficulty": "초급",
    "url": "https://huggingface.co/learn/llm-course/en/chapter1/1",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "공식 문서에서 무료·광고 없음으로 안내합니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "과정 소개에서 전체 수료증의 발급 비용·조건을 확인하지 못했습니다."
    },
    "requirements": "Python 기초 및 딥러닝 입문 지식을 권장합니다.",
    "note": "전체 수료증의 발급 조건은 공식 과정에서 확인하세요.",
    "evidenceUrls": [
      "https://huggingface.co/learn/llm-course/en/chapter1/1"
    ]
  },
  {
    "id": "hf-agents",
    "completionCertificateVerified": true,
    "name": "Hugging Face Agents Course",
    "provider": "Hugging Face",
    "type": "course",
    "language": "en",
    "difficulty": "중급",
    "url": "https://huggingface.co/learn/agents-course/en/unit0/introduction",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "공식 무료 과정. 외부 실행 환경의 사용량 요금은 별도일 수 있습니다."
    },
    "credentialFee": {
      "status": "free",
      "note": "기초 과정 및 최종 과제 등 해당 수료증의 조건을 충족해야 합니다."
    },
    "requirements": "Python·LLM 기초, 실습용 Hugging Face 계정이 필요합니다.",
    "note": "계정·실습 조건은 외부 교육 제공처의 조건이며 이 서비스는 기록을 저장하지 않습니다.",
    "evidenceUrls": [
      "https://huggingface.co/learn/agents-course/en/unit0/introduction"
    ]
  },
  {
    "id": "elementsofai",
    "name": "Elements of AI (Introduction to AI)",
    "provider": "University of Helsinki / MinnaLearn",
    "type": "course",
    "language": "en",
    "difficulty": "초급",
    "url": "https://www.elementsofai.com/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "Introduction to AI 과정 기준. Building AI와 구분합니다."
    },
    "credentialFee": {
      "status": "free",
      "note": "Introduction 과정 과제·동료평가를 통과하면 디지털 수료증 발급."
    },
    "requirements": "필수 과제와 동료평가 완료 및 검토 대기가 필요합니다.",
    "evidenceUrls": [
      "https://www.elementsofai.com/",
      "https://community.elementsofai.com/c/elements-faq/i-have-passed-an-elements-of-ai-course-where-is-my-certificate"
    ],
    "note": "Building AI 과정의 유료 수료증을 Introduction 과정과 혼동하지 마세요."
  },
  {
    "id": "google-ai-essentials",
    "completionCertificateVerified": true,
    "name": "Google AI Essentials",
    "provider": "Google",
    "type": "course",
    "language": "ko",
    "difficulty": "초급",
    "url": "https://grow.google/intl/ko_kr/ai-essentials/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "paid",
      "note": "Coursera 유료 등록·구독 과정. 한국 가격은 등록 화면에서 확인하세요."
    },
    "credentialFee": {
      "status": "paid",
      "note": "유료 과정 완료 시 수료증 제공. 무료체험·지원금이 무조건 무료 수료를 보장하지 않습니다."
    },
    "requirements": "별도 선행 경험 없이 시작하는 자기주도 학습 과정입니다.",
    "evidenceUrls": [
      "https://grow.google/intl/ko_kr/ai-essentials/",
      "https://grow.google/ai-essentials/"
    ],
    "note": "미국·캐나다 가격을 한국 고정 가격으로 표시하지 않습니다."
  },
  {
    "id": "coursera-ai-for-everyone",
    "completionCertificateVerified": true,
    "name": "AI For Everyone (Andrew Ng)",
    "provider": "Coursera / DeepLearning.AI",
    "type": "course",
    "language": "both",
    "difficulty": "초급",
    "url": "https://www.coursera.org/learn/ai-for-everyone",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "conditional",
      "note": "유료 등록이 기본이며 무료체험·청강·재정지원은 해당 계정에 제공되는 옵션을 확인해야 합니다."
    },
    "credentialFee": {
      "status": "paid",
      "note": "수료증 경로 구매와 필수 평가 통과가 필요합니다. 지원금 승인은 별도입니다."
    },
    "requirements": "선행 경험 없이 시작 가능. 재정지원은 신청·심사 조건을 확인하세요.",
    "note": "무료체험 기간과 수료증 발급 조건은 등록 화면에서 확인하세요.",
    "evidenceUrls": [
      "https://www.coursera.org/learn/ai-for-everyone"
    ]
  },
  {
    "id": "gcp-generative-ai-skill-badge",
    "name": "Google Cloud Generative AI Skills Boost",
    "provider": "Google Cloud",
    "type": "micro",
    "examCode": "Skill Badge",
    "language": "en",
    "difficulty": "초급",
    "url": "https://skills.cloud.google/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "conditional",
      "note": "GEAR 가입 시 월 35 학습 크레딧 안내. 과정별 소모량·추가 구매 조건 확인."
    },
    "credentialFee": {
      "status": "conditional",
      "note": "스킬 배지는 해당 실습·평가 통과가 필요하며 크레딧 한도를 넘으면 비용이 발생할 수 있습니다."
    },
    "requirements": "외부 Google 학습 계정과 프로그램 가입 및 과정별 실습 요건을 확인하세요.",
    "evidenceUrls": [
      "https://skills.cloud.google/",
      "https://cloud.google.com/developers"
    ],
    "note": "기관의 스킬 배지이며 이 서비스의 개인 배지 기능과 무관합니다."
  },
  {
    "id": "msft-applied-skills-ai",
    "name": "Microsoft Applied Skills: Azure AI",
    "provider": "Microsoft",
    "type": "micro",
    "language": "unknown",
    "difficulty": "초급",
    "url": "https://learn.microsoft.com/certifications/applied-skills/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "Microsoft Learn 자기주도 학습 자료. 별도 강사 과정은 유료일 수 있습니다."
    },
    "credentialFee": {
      "status": "unknown",
      "note": "카탈로그는 무료 평가를 포함하지만 개별 Azure AI 자격별 조건을 확인해야 합니다."
    },
    "requirements": "단일 시험이 아닌 Applied Skills 카탈로그입니다. 원하는 AI 자격의 실습 요건 확인.",
    "evidenceUrls": [
      "https://learn.microsoft.com/certifications/applied-skills/",
      "https://learn.microsoft.com/en-us/credentials/support/prepare-assessment-lab",
      "https://learn.microsoft.com/en-us/credentials/microsoft-credentials-ai-challenge"
    ],
    "note": "카탈로그 전체의 언어·비용·영구 유효를 일괄 보장하지 않습니다."
  }
];
