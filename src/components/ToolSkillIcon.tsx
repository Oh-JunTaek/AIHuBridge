// 기능의 의미별 자체 선 아이콘. 기업 로고를 나타내지 않는다.
const groups: Record<string, string> = {
  '자료 질문': 'chat', '대화 기록': 'chat', '코드 설명': 'code', '코드 제안': 'code', '프로그래밍 학습': 'code',
  '출처 확인': 'link', '출처 링크': 'link', '연구 근거': 'link', '근거 확인': 'link',
  '웹 검색': 'search', '주제 조사': 'search', '논문 검색': 'search', '초록 확인': 'document', '자료 요약': 'document', '한국어 요약': 'document',
  '문장 번역': 'text', '문장 교정': 'text', '표현 제안': 'text', 'AI 글쓰기': 'text',
  '오디오 요약': 'sound', '음성 인식': 'sound', '음성 생성': 'sound', '음성 기록': 'sound', '발음 듣기': 'sound',
  '발표 자료': 'visual', '디자인 편집': 'visual', '시각 자료': 'visual', '슬라이드': 'visual', '흐름도': 'visual',
};
const paths: Record<string, string> = {
  chat: 'M4 5h16v11H9l-4 3v-3H4z', code: 'M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16',
  link: 'M10 13a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-2 2M14 11a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l2-2',
  search: 'M10 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM15 15l5 5', document: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
  text: 'M4 5h10M9 3v2c0 6-2 9-5 11M5 9c1 3 3 5 6 7M14 20l3-8 3 8M15 18h4',
  sound: 'M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4', visual: 'M4 5h16v12H4zM8 21h8M12 17v4M7 13l3-3 3 2 4-4',
};
export function ToolSkillIcon({ skill }: { skill: string }) {
  return <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center text-blue-700"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d={paths[groups[skill] ?? 'document']} /></svg></span>;
}
