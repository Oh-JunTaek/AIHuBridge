import type { GlossaryEntry } from '../types';

/**
 * AI Compass 용어 사전 (비전공자용, 2026-10 현재 기준).
 * 모델 = 프롬프트 ≠ 훈련 데이터 ≠ 경량화 라는 선을 잡아요.
 */
export const glossary: GlossaryEntry[] = [
  {
    term: '대형 언어 모델(LLM)',
    definition: '대량의 텍스트로 훈련해 한국어를 이해·생성하는 AI 모델. ChatGPT 같은 챗봇의 핵심.',
    example: '질문을 받아서 "서울 날씨 어때?"라고 답한다.',
    related: ['파인튜닝', '토큰'],
  },
  {
    term: '생성 AI(Generative AI)',
    definition: '텍스트·이미지·음악 같은 새로운 콘텐츠를 만드는 AI. 기존에 "찾아내는" AI와 구분.',
    related: ['대형 언어 모델(LLM)', '확산 모델'],
  },
  {
    term: '프롬프트',
    definition: 'LLM에게 줘야 할 명령이나 질문. 좋은 프롬프트일수록 더 정확한 답이 나온다.',
    example: '"300자 이상으로 요약해 주세요 (비전공자도 이해하기 쉽게)"',
    related: ['프롬프트 엔지니어링'],
  },
  {
    term: '프롬프트 엔지니어링',
    definition: 'LLM이 원하는 대답을 하도록 프롬프트를 체계적으로 만드는 기술.',
    related: ['프롬프트'],
  },
  {
    term: '토큰',
    definition: 'LLM이 처리하는 글자 덩어리. 한국어 1단어 ≈ 2~3 토큰. 요금도 토큰 단위로 척도.',
    related: ['대형 언어 모델(LLM)'],
  },
  {
    term: '파인튜닝',
    definition: '일반 LLM에게 특정 분야 지식을 덮어씌워 성능을 올리는 방법. 비싸고 리스크 있음.',
    related: ['대형 언어 모델(LLM)', '전이 학습'],
  },
  {
    term: '전이 학습',
    definition: '이미 훈련된 모델을 범용 지식 그대로 두고, 새 작업에 맞게 미세 조정하는 전략.',
    related: ['파인튜닝'],
  },
  {
    term: 'RAG',
    definition: 'Retrieval-Augmented Generation. 문답 전에 "문서에서 찾아 답하면" 더 정확히 대사는 기법.',
    related: ['검색 증강', '벡터 DB'],
  },
  {
    term: '벡터 DB',
    definition: '문장을 숫자 배열(벡터)로 저장해 의미로 찾아내는 데이터베이스. RAG의 핵심 부품.',
    example: 'Qdrant, Pinecone, Chroma',
    related: ['RAG'],
  },
  {
    term: '임베딩',
    definition: '단어/문장을 숫자(벡터)로 바꾸어 의미를 표현한 것. "비슷한 뜻"을 계산 가능.',
    related: ['벡터 DB', 'RAG'],
  },
  {
    term: 'Agent',
    definition: 'LLM이 "계획→도구 사용→결과 확인"을 반복하며 스스로 행동하는 시스템.',
    example: '메일 정리 → 달력에 일정 추가 → 보고서 작성',
    related: ['Tool use', 'Multi-turn'],
  },
  {
    term: 'Tool use (도구 사용)',
    definition: 'LLM이 계산기·검색·코드 실행 같은 외부 도구를 호출하는 능력.',
    related: ['Agent'],
  },
  {
    term: '멀티턴 대화',
    definition: '한 번의 질문만 따로보고 연속 대화 맥락을 기억하지 못하는 LLM을 "이어지게" 하는 방법.',
    related: ['Agent'],
  },
  {
    term: 'Temperature',
    definition: 'LLM 답변의 "창의성/무작위성" 조절 값. 0에 가까울수록 답이 딱딱해지고, 크면 변화.',
    example: '수험지문 자동 채점엔 0, 스토리 만들기엔 0.7',
  },
  {
    term: 'Top-k / Top-p (핵심집중)',
    definition: 'LLM이 다음 단어를 고를 때 "후보 중에서만" 뽑도록 제한하는 설정. 답이 어색해지지 않게.',
    related: ['Temperature'],
  },
  {
    term: '확산 모델(Diffusion Model)',
    definition: '점점 노이즈를 줄여가며 이미지를 생성하는 모델. DALL·E·Midjourney의 원리.',
    related: ['생성 AI'],
  },
  {
    term: '트랜스포머(Transformer)',
    definition: '2017년 논문에서 제시한 "어텐션" 기반 구조. 오늘날 LLM·이미지 모델의 뼈대.',
    related: ['대형 언어 모델(LLM)'],
  },
  {
    term: '어텐션(Attention)',
    definition: '문장 안에서 단어끼리 "얼굴을 얼마나 보는가"를 계산해 핵심 연결고리를 찾는 메커니즘.',
    related: ['트랜스포머'],
  },
  {
    term: '베이스라인',
    definition: 'AI 평가할 때 "무난한 출발점"으로 쓰는 방법론. 개선 전 성능 기준.',
    related: ['평가지표'],
  },
  {
    term: '벤치마크',
    definition: '여러 AI 모델을 똑같은 문제로 시험시켜 누가 잘했는지 가리는 표준 평가지표.',
    example: 'MMLU, HumanEval, 한국어능력 평가',
    related: ['평가지표'],
  },
  {
    term: '평가지표(Metric)',
    definition: 'AI가 얼마나 잘했는지 수치로 보는 기준 (정확도, BLEU, F1, ROUGE 등).',
  },
  {
    term: 'A/B 테스트',
    definition: '두 버전(A/B)을 나란히 보여 서로의 성능을 비교하는 방법. 마케팅·추천에 많이 써.',
    related: ['베이스라인'],
  },
  {
    term: '지도학습',
    definition: '정답이 있는 데이터로 훈련시킨 뒤, 새 데이터를 "맞췄다/틀렸다" 평가하는 가장 기본적인 방법.',
    related: ['비지도학습'],
  },
  {
    term: '비지도학습',
    definition: '정답 없이 패턴만 찾아냅니다. 군집화·이상치 탐지에 주로 씁니다.',
    related: ['지도학습'],
  },
  {
    term: '강화학습',
    definition: '보상을 주고 행동을 반복하도록 훈련. 로봇 제어·게임 AI에 유명.',
    related: ['Reward'],
  },
  {
    term: 'Reward (보상)',
    definition: '강화학습에서 "좋은 행동"을 가로채는 신호. 설계가 잘못되면 이상한 행동이 생깁.',
    related: ['강화학습'],
  },
  {
    term: '경량화',
    definition: '크기·속도는 유지하되 파일 용량을 줄이는 기법. "양자화/프루닝/지식 전이".',
    example: '4bit 양자화 → 파일 용량 75%↓, 속도↑',
    related: ['Quantization'],
  },
  {
    term: '양자화(Quantization)',
    definition: '소수점 숫자를 정수로 바꿔 모델을 작게 만드는 기법. 4bit/8bit가 일반적.',
    related: ['경량화'],
  },
  {
    term: '온디바이스',
    definition: '휴대폰/컴퓨터 속에서 로컬로 구동하는 AI. 클라우드 의존도 ↓, 프라이버시 ↑',
    related: ['경량화'],
  },
  {
    term: 'Hallucination (환각)',
    definition: '확신 어린 말 한 마디가 **사실과 다를 때**. LLM이 존재하지 않는 정보를 말아내는 현상.',
    example: '"2026년 6월32일" 같은 날짜가 나오면 경계!',
  },
  {
    term: '프롬프트 인젝션',
    definition: '악의적 내용이 담긴 문장을 LLM이 읽게 해 내부 규칙을 무시하게 하는 공격 기법.',
    related: ['Safety'],
  },
  {
    term: 'LLMOps',
    definition: 'LLM 서비스를 운영할 때 "버전/비용/품질/안전"을 관리하는 실무.',
  },
  {
    term: 'Inference (추론)',
    definition: '훈련된 모델이 실제로 질문에 답하는 시간. 보통 "API 호출 1번"에 해당.',
  },
  {
    term: 'Fine-tuning',
    definition: '(파인튜닝의 영어어) 범용 모델을 개별 목적에 맞게 미세 조정. 비싸고 데이터 민감.',
    related: ['전이 학습'],
  },
  {
    term: 'Embedding',
    definition: '(임베딩의 영어어) "텍스트→숫자" 변환. 의미 검색의 기본 단위.',
    related: ['벡터 DB'],
  },
];
