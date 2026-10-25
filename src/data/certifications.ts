import type { Certification } from '../types';

// 비용·수료·선행 요건은 정적 검토 자료다. 근거 URL과 검토일을 함께 유지한다.
export const certifications: Certification[] = [
  {
    "id": "aws-ai-business-strategist",
    "name": "AWS Certified AI Business Strategist",
    "provider": "Amazon Web Services",
    "type": "exam",
    "examCode": "베타 시험",
    "language": "en",
    "difficulty": "초급",
    "url": "https://aws.amazon.com/certification/certified-ai-business-strategist/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "conditional",
      "note": "공식 예제 문제와 학습 자료 제공. 일부 준비 과정·실습은 유료일 수 있습니다."
    },
    "credentialFee": {
      "status": "paid",
      "amount": 50,
      "currency": "USD",
      "note": "베타 응시료 USD $50. 정식 시험 예정가 $100과 구분하며 세금·지역 가격은 원문 확인."
    },
    "requirements": "AI 비즈니스 의사결정에 관심 있는 사람 대상. 코딩·AWS 구현 경험은 필수가 아닙니다.",
    "note": "베타 운영 중. 베타 가격과 정식 가격을 혼동하지 마세요.",
    "evidenceUrls": [
      "https://aws.amazon.com/certification/certified-ai-business-strategist/"
    ]
  },
  {
    "id": "aws-ml-associate",
    "name": "AWS Certified Machine Learning Engineer – Associate",
    "provider": "Amazon Web Services",
    "type": "exam",
    "examCode": "MLA-C01 / 차기 버전 베타",
    "language": "en",
    "difficulty": "중급",
    "url": "https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/",
    "verifiedAt": "2026-10-26",
    "validity": "3년",
    "learningFee": {
      "status": "conditional",
      "note": "공식 예제·준비 자료 제공. 실습·구독형 준비 과정의 비용은 별도 확인."
    },
    "credentialFee": {
      "status": "conditional",
      "note": "MLA-C01 $150, 차기 버전 베타 $75. 언어·버전별 응시 가능 여부와 세금은 원문 확인."
    },
    "requirements": "ML 엔지니어링·AWS 실무 경험 각 1년 수준을 권장합니다.",
    "note": "영어 MLA-C01은 2026-09-28 종료 안내. 다른 언어와 베타 버전은 공식 페이지에서 확인하세요.",
    "evidenceUrls": [
      "https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/"
    ]
  },
  {
    "id": "gcp-generative-ai-leader",
    "name": "Google Cloud Generative AI Leader",
    "provider": "Google Cloud",
    "type": "exam",
    "examCode": "GEN-AI-LEAD",
    "language": "en",
    "difficulty": "초급",
    "url": "https://cloud.google.com/learn/certification/generative-ai-leader",
    "verifiedAt": "2026-10-26",
    "validity": "3년",
    "learningFee": {
      "status": "conditional",
      "note": "무료 예제 문제·학습 경로 안내. 실습과 구독 비용은 별도 확인."
    },
    "credentialFee": {
      "status": "paid",
      "amount": 99,
      "currency": "USD",
      "note": "응시료에 해당 지역 세금이 추가될 수 있습니다."
    },
    "requirements": "사전 자격 요건 없음. 비기술 직군도 응시할 수 있습니다.",
    "note": "한국어 시험 제공은 확인되지 않았습니다.",
    "evidenceUrls": [
      "https://cloud.google.com/learn/certification/generative-ai-leader"
    ]
  },
  {
    "id": "gcp-machine-learning-engineer",
    "name": "Google Cloud Professional Machine Learning Engineer",
    "provider": "Google Cloud",
    "type": "exam",
    "examCode": "Professional ML Engineer",
    "language": "en",
    "difficulty": "고급",
    "url": "https://cloud.google.com/learn/certification/machine-learning-engineer",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "conditional",
      "note": "공식 예제 문제·문서 제공. 실습·교육 과정 비용은 별도 확인."
    },
    "credentialFee": {
      "status": "paid",
      "amount": 200,
      "currency": "USD",
      "note": "응시료에 해당 지역 세금이 추가될 수 있습니다."
    },
    "requirements": "필수 선행 자격은 없으나 업계 경력 3년 이상·Google Cloud 경험 1년 이상을 권장합니다.",
    "note": "영어·일본어 시험. 갱신 조건은 공식 FAQ 확인.",
    "evidenceUrls": [
      "https://cloud.google.com/learn/certification/machine-learning-engineer"
    ]
  },
  {
    "id": "msft-ai-900",
    "name": "Microsoft Azure AI Fundamentals (AI-901)",
    "provider": "Microsoft",
    "type": "exam",
    "examCode": "AI-901",
    "language": "both",
    "difficulty": "초급",
    "url": "https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/",
    "verifiedAt": "2026-10-26",
    "learningFee": {
      "status": "free",
      "note": "Microsoft Learn 자기주도 학습 자료. 강사 교육은 별도 비용일 수 있습니다."
    },
    "credentialFee": {
      "status": "paid",
      "note": "응시 지역에 따라 가격이 달라집니다. 기존 고정 $99 표기를 제거했습니다."
    },
    "requirements": "Python 기초 문법·Azure 리소스 및 AI 개념 이해가 필요합니다.",
    "note": "AI-900 종료 안내에 따라 대체 시험 AI-901을 안내합니다.",
    "evidenceUrls": [
      "https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/"
    ]
  },
  {
    "id": "dlai-prompting",
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
