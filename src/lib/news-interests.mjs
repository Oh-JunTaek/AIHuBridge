// 관심 분야는 원문에 나타난 표현을 이용한 탐색 단서이며 정답 판정이 아니다.
export const interestLabels = {
  language: '언어·LLM', image: '이미지', video: '영상', audio: '음성·음악',
  multimodal: '멀티모달', reasoning: '추론·판단', agents: '에이전트·로봇',
  code: '코딩', search: '검색·임베딩', timeseries: '예측·시계열', safety: '안전·보안',
};
const patterns = {
  language: /\b(?:LLMs?|large language models?|language models?|natural language processing|NLP|GPT-?\d|Claude|Gemini|Llama|Qwen|Gemma|HyperCLOVA|Kanana)\b|언어\s*모델|대규모\s*언어|자연어\s*처리|하이퍼클로바|카나나/i,
  image: /\b(?:image|images|imaging|text.to.image|image generation|diffusion models?|computer vision|visual recognition|object detection|FLUX|Imagen)\b|이미지|그림\s*생성|컴퓨터\s*비전|시각\s*인식/i,
  video: /\b(?:video|videos|text.to.video|video generation|video understanding|Veo|Sora)\b|동영상|영상\s*(?:생성|모델|이해|분석|인식)|비디오/i,
  audio: /\b(?:audio|speech|voice|music|text.to.speech|TTS|ASR|Whisper|Voxtral)\b|음성|오디오|음악\s*(?:생성|모델|인식)/i,
  multimodal: /\b(?:multimodal|multi.modal|vision.language)\b|멀티모달|다중\s*모달/i,
  reasoning: /\b(?:reasoning|decision.making|decision models?|classification models?)\b|추론|판단\s*(?:모델|시스템|능력)|의사\s*결정/i,
  agents: /\b(?:AI agents?|agentic|autonomous agents?|robotics|robots?|world models?)\b|AI\s*에이전트|에이전트|로봇|월드\s*모델/i,
  code: /\b(?:coding|code generation|code models?|programming|software engineering|CodeLlama)\b|코딩|코드\s*(?:생성|모델|작성)|프로그래밍/i,
  search: /\b(?:embeddings?|retrieval.augmented|RAG|semantic search|retrieval models?|AI search)\b|임베딩|검색\s*증강|의미\s*검색|AI\s*검색/i,
  timeseries: /\b(?:time.series|forecasting|forecast models?|prediction models?)\b|시계열|예측\s*(?:모델|시스템)/i,
  safety: /\b(?:AI safety|AI security|model safety|alignment|adversarial attacks?|prompt injection|cybersecurity)\b|AI\s*(?:안전|보안)|모델\s*(?:안전|보안)|프롬프트\s*인젝션|적대적\s*공격/i,
};
export function newsInterests(item) {
  const title = (item.title ?? '').replace(/\s+-\s+[^-]+$/, '');
  const text = `${title} ${item.excerpt ?? ''} ${item.summary ?? ''}`;
  const categories = item.paperCategories ?? [];
  return Object.keys(interestLabels).filter((key) => patterns[key].test(text)
    || (key === 'language' && categories.includes('cs.CL'))
    || (key === 'audio' && categories.includes('cs.SD'))
    || (key === 'agents' && categories.includes('cs.RO')));
}
