export type ToolKind = '학습·자료' | '논문·검색' | '번역·글쓰기' | '디자인' | '코딩' | '음성·회의' | '시각화';
export interface AiTool { id: string; name: string; provider: string; kinds: ToolKind[]; description: string; example: string; free: string; limits: string; account: string; url: string; evidence: string; checked: string; role: string; skills: string[] }

// 무료 범위는 제공처의 공개 안내를 기준으로 하며 사용량을 보장하지 않는다.
const baseTools: Omit<AiTool, 'role' | 'skills'>[] = [
  { id: 'notebooklm', name: 'NotebookLM', provider: 'Google', kinds: ['학습·자료'], description: '내가 고른 자료를 바탕으로 질문하고 학습 내용을 정리합니다.', example: '강의 자료나 문서를 모아 핵심 내용을 질문하고 출처를 확인하기', free: '무료 표준 이용 가능', limits: '대화·자료·생성 기능에 사용 한도가 있으며 변경될 수 있습니다.', account: 'Google 계정 필요', url: 'https://notebooklm.google.com/', evidence: 'https://support.google.com/gemininotebook/answer/16213268', checked: '2026-11-07' },
  { id: 'perplexity', name: 'Perplexity', provider: 'Perplexity', kinds: ['논문·검색', '학습·자료'], description: '웹 검색과 출처 링크를 함께 살펴보며 주제를 조사합니다.', example: '처음 접하는 AI 개념을 검색하고 원문을 비교하기', free: '기본 검색 무료', limits: '고급 검색과 파일 업로드는 무료 이용량이 제한됩니다.', account: '기능에 따라 계정 필요', url: 'https://www.perplexity.ai/', evidence: 'https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you', checked: '2026-11-07' },
  { id: 'consensus', name: 'Consensus', provider: 'Consensus', kinds: ['논문·검색'], description: '연구 주제와 관련된 학술 논문을 검색하고 자료를 살펴봅니다.', example: '관심 주제의 논문을 찾고 초록과 원문 출처 확인하기', free: '기본 논문 검색 무료', limits: '고급 질의와 심층 검토는 무료 이용량이 제한됩니다.', account: '기능에 따라 계정 필요', url: 'https://consensus.app/', evidence: 'https://help.consensus.app/en/articles/10087865-subscription-plans', checked: '2026-11-07' },
  { id: 'deepl', name: 'DeepL', provider: 'DeepL', kinds: ['번역·글쓰기', '학습·자료'], description: '외국어 자료의 번역과 문장 표현을 살펴봅니다.', example: '영문 자료의 짧은 문장을 번역하고 원문과 비교하기', free: '번역·쓰기 무료 기능 제공', limits: '텍스트 길이와 문서 기능에 제한이 있으며 일부 기능은 유료입니다.', account: '일부 기능은 계정 필요', url: 'https://www.deepl.com/translator', evidence: 'https://www.deepl.com/en/terms-of-use', checked: '2026-11-07' },
  { id: 'canva', name: 'Canva', provider: 'Canva', kinds: ['디자인'], description: '발표 자료와 시각 자료를 만들며 일부 AI 기능을 활용합니다.', example: '학습한 내용을 발표 슬라이드로 정리하기', free: '무료 디자인 도구와 일부 AI 기능', limits: '무료 AI 사용량이 제한되며 일부 템플릿·기능은 유료입니다.', account: '일부 기능은 Canva 계정 필요', url: 'https://www.canva.com/', evidence: 'https://www.canva.com/help/using-canva-ai/', checked: '2026-11-07' },
  { id: 'copilot', name: 'GitHub Copilot', provider: 'GitHub', kinds: ['코딩'], description: '코드를 작성하거나 이해할 때 AI의 제안을 참고합니다.', example: '파이썬 예제의 동작을 질문하고 직접 실행해 보기', free: 'Copilot Free 제공', limits: '무료 코드 완성과 AI 기능 이용량에 제한이 있습니다.', account: 'GitHub 계정 및 지원 환경 필요', url: 'https://github.com/features/copilot', evidence: 'https://docs.github.com/en/copilot/get-started/plans', checked: '2026-11-07' },
  { id: 'clovanote', name: '클로바노트', provider: 'NAVER', kinds: ['음성·회의', '학습·자료'], description: '녹음한 음성을 텍스트로 바꾸고 대화 내용을 정리합니다.', example: '동의받은 강의나 회의를 기록하고 필요한 구간 다시 찾기', free: '개인용 무료', limits: '녹음·변환 시간과 AI 요약 횟수가 제한됩니다. AI 요약은 한국어 인식 시 지원됩니다.', account: '만 14세 이상 네이버 개인 계정 필요', url: 'https://clovanote.naver.com/', evidence: 'https://help.naver.com/service/24269/contents/12814?osType=COMMONOS', checked: '2026-11-07' },
  { id: 'liner', name: 'Liner Scholar', provider: 'Liner', kinds: ['논문·검색', '학습·자료'], description: '학술 자료를 찾고 출처를 참고해 연구 질문을 살펴봅니다.', example: '관심 주제에 관해 질문하고 답변에 인용된 논문 확인하기', free: '무료 검색 제공', limits: '무료 크레딧과 파일 업로드에 제한이 있으며 일부 연구 기능은 유료입니다.', account: '일부 기능은 계정 필요', url: 'https://liner.com/scholar', evidence: 'https://liner.com/pricing', checked: '2026-11-08' },
  { id: 'elicit', name: 'Elicit', provider: 'Elicit', kinds: ['논문·검색'], description: '연구 질문을 바탕으로 논문을 검색하고 근거를 살펴봅니다.', example: '연구 주제의 논문을 찾고 논문의 요약과 출처 비교하기', free: '기본 논문 검색 무료', limits: '심층 리서치와 보고서 생성은 무료 사용량이 제한됩니다.', account: '일부 기능은 계정 필요', url: 'https://elicit.com/', evidence: 'https://elicit.com/pricing', checked: '2026-11-07' },
  { id: 'napkin', name: 'Napkin AI', provider: 'Napkin AI', kinds: ['시각화', '디자인'], description: '텍스트의 핵심 관계를 시각 자료로 바꿔 봅니다.', example: '복잡한 개념을 정리한 문장으로 흐름도 만들기', free: '기본 시각화 무료', limits: 'AI 생성 크레딧은 주기별로 제한되고 일부 내보내기 횟수도 제한됩니다.', account: '계정 필요', url: 'https://www.napkin.ai/', evidence: 'https://help.napkin.ai/en/articles/15955724-credits-plans', checked: '2026-11-07' },
  { id: 'elevenlabs', name: 'ElevenLabs', provider: 'ElevenLabs', kinds: ['음성·회의'], description: '텍스트를 음성으로 읽거나 음성 자료를 텍스트로 바꿉니다.', example: '짧은 학습 문장을 음성으로 만들어 듣기', free: '무료 음성 기능 제공', limits: '무료 크레딧에 한도가 있으며 상업적 이용은 유료 조건을 확인해야 합니다.', account: '계정 필요', url: 'https://elevenlabs.io/', evidence: 'https://elevenlabs.io/pricing', checked: '2026-11-07' },
];

// 배지와 기능 태그는 가격이 아닌 도구의 핵심 활용을 설명한다.
const toolHighlights: Record<string, Pick<AiTool, 'role' | 'skills'>> = {
  notebooklm: { role: '자료 기반 학습', skills: ['자료 질문', '출처 확인', '오디오 요약'] },
  perplexity: { role: 'AI 웹 검색', skills: ['웹 검색', '출처 링크', '주제 조사'] },
  consensus: { role: '논문 탐색', skills: ['논문 검색', '연구 근거', '초록 확인'] },
  deepl: { role: '번역과 글쓰기', skills: ['문장 번역', '문장 교정', '표현 제안'] },
  canva: { role: '시각 자료 제작', skills: ['발표 자료', '디자인 편집', 'AI 글쓰기'] },
  copilot: { role: '코딩 도우미', skills: ['코드 제안', '코드 설명', '프로그래밍 학습'] },
  clovanote: { role: '음성 기록', skills: ['음성 인식', '대화 기록', '한국어 요약'] },
  liner: { role: '논문 기반 조사', skills: ['논문 검색', '출처 확인', '자료 요약'] },
  elicit: { role: '연구 자료 탐색', skills: ['논문 검색', '자료 요약', '근거 확인'] },
  napkin: { role: '개념 시각화', skills: ['흐름도', '시각 자료', '슬라이드'] },
  elevenlabs: { role: 'AI 음성', skills: ['음성 생성', '음성 기록', '발음 듣기'] },
};
export const aiTools: AiTool[] = baseTools.map((tool) => ({ ...tool, ...toolHighlights[tool.id] }));
