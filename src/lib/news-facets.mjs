import { newsSources } from './news-sources.mjs';

export const modelTypes = { language: '언어 모델', reasoning: '추론·판단 모델', audio: '음성·음악 모델', image: '이미지 모델', video: '영상 모델', multimodal: '멀티모달', code: '코딩 모델', robotics: '로봇·월드 모델', embedding: '임베딩·검색 모델', timeseries: '시계열·예측 모델', other: '기타 모델' };
export const opennessLabels = { open: '오픈소스 언급', weights: '가중치 공개 언급', closed: '비공개 언급', unknown: '미확인·혼합' };
export const publicationLabels = { developer: '기업 공식 채널', community: '커뮤니티·플랫폼', media: '언론·매체', paper: '논문 저장소', government: '공공기관 공식 채널' };
export const topicGroups = {
  models: modelTypes,
  papers: { language: '언어·추론', vision: '시각·이미지·영상', audio: '음성·오디오', learning: '학습·최적화', agents: '에이전트·로봇', safety: '안전·평가' },
  products: { launch: '제품·기능 출시', infrastructure: '반도체·인프라', business: '투자·제휴·사업', tools: '개발 도구·API' },
  policy: { regulation: '법·규제', copyright: '저작권', privacy: '개인정보·보안', safety: '안전·거버넌스' },
  software: { model: '모델', framework: '프레임워크·라이브러리', data: '데이터셋', tool: '도구·서비스' },
  media: { report: '연구·조사 보도', interview: '인터뷰', opinion: '기고·칼럼', launch: '신제품·발표 보도' },
};
export const paperKinds = { survey: '서베이·리뷰', benchmark: '벤치마크·평가', dataset: '데이터셋', method: '방법·모델 제안' };
export const companies = ['OpenAI', 'Google', 'Anthropic', 'Microsoft', 'Meta', 'NVIDIA', 'Mistral', 'Amazon', 'Alibaba', 'Hugging Face', 'xAI', 'NAVER', '카카오', '삼성전자', 'LG AI연구원', 'SK텔레콤', '업스테이지'];
const patterns = {
  models: {
    language: /\b(?:LLM|language model|GPT[-\d\s]|Claude|Llama|Qwen|Gemma|Gemini|Mistral Large|HyperCLOVA|Kanana)\b|언어\s*모델|클로드|큐웬|제미나이|젬마|라마\s*\d|하이퍼클로바|카나나/i,
    reasoning: /reasoning|decision.making|classification model|추론|판단\s*모델|분류\s*모델/i,
    audio: /speech|audio|text.to.speech|\bTTS\b|\bASR\b|Whisper|Voxtral|Lyria|음성|오디오|음악\s*모델/i,
    image: /image|text.to.image|diffusion|\bFLUX\b|Imagen|Nano Banana|이미지|그림\s*생성/i,
    video: /video|\bVeo\b|\bSora\b|영상|동영상/i,
    multimodal: /multimodal|multi.modal|멀티모달/i,
    code: /code generation|coding model|CodeLlama|코딩\s*모델|코드\s*생성/i,
    robotics: /robotics|world model|\bGenie\b|로봇|월드\s*모델/i,
    embedding: /embedding|retrieval model|임베딩|검색\s*모델/i,
    timeseries: /time.series|forecast|Timestral|시계열|예측\s*모델/i,
  },
  papers: {
    language: /cs\.CL|language|reasoning|\bLLM\b|언어|추론/i,
    vision: /cs\.CV|image|video|vision|visual|diffusion|시각|이미지|영상/i,
    audio: /cs\.SD|audio|speech|music|음성|오디오/i,
    learning: /cs\.LG|learning|training|optimization|학습|최적화/i,
    agents: /agent|robot|planning|에이전트|로봇|계획/i,
    safety: /safety|alignment|evaluation|benchmark|안전|평가|정렬/i,
  },
  products: { launch: /launch|introduc|releas|출시|공개|신제품|새\s*기능/i, infrastructure: /chip|GPU|infrastructure|data.?center|반도체|인프라|데이터센터/i, business: /invest|partner|funding|acqui|투자|제휴|인수|사업/i, tools: /\bAPI\b|SDK|developer|개발\s*도구/i },
  policy: { regulation: /regulat|legislat|\blaw\b|규제|법안|법률/i, copyright: /copyright|저작권/i, privacy: /privacy|security|개인정보|보안/i, safety: /safety|governance|안전|거버넌스/i },
  software: { model: /\bmodel\b|모델/i, framework: /framework|library|PyTorch|TensorFlow|프레임워크|라이브러리/i, data: /dataset|데이터셋/i, tool: /tool|\bSDK\b|도구|서비스/i },
  media: { report: /study|research|survey|report|연구|조사|보고서/i, interview: /interview|인터뷰/i, opinion: /opinion|column|기고|칼럼/i, launch: /launch|introduc|releas|출시|공개|발표/i },
};
// 제목의 모델 대상과 출시 근거를 모두 요구한다. 일반 활용·비교·제품 출시는 제외한다.
export function isModelRelease(item) {
  const title = (item.title ?? '').replace(/\s+-\s+[^-]+$/, '');
  const target = /(?:\b(?:AI|LLM|language|reasoning|decision|classification|audio|speech|voice|music|image|video|vision|multimodal|coding|robotics|world|embedding|forecast(?:ing)?)\b[\s\w-]{0,35}\bmodels?\b)|(?:\bmodels?\b[\s\w-]{0,20}\b(?:AI|language|reasoning|audio|speech|image|video|multimodal)\b)|(?:인공지능|생성형|언어|추론|판단|분류|음성|오디오|음악|이미지|영상|동영상|멀티모달|코딩|로봇|월드|임베딩|예측|시계열|AI)\s*(?:생성|인식|판단|분류|기반|거대|대형|신규|새로운|신형|차세대|AI|\s)*\s*모델|\b(?:GPT[- ]?\d[\w.-]*|Claude\s+\d[\w. -]*|Gemini\s+\d[\w. -]*|Llama\s*\d[\w. -]*|Qwen\s*\d[\w. -]*|Gemma\s*\d[\w. -]*|Veo\s*\d[\w. -]*|Sora\s*\d[\w. -]*|FLUX[. -]?\d[\w. -]*|HyperCLOVA[\w -]*|Kanana[\w -]*)\b|하이퍼클로바|카나나/i.test(title);
  const launched = /\b(?:introduc(?:e|es|ing)|launch(?:es|ed|ing)?|releas(?:e|es|ed|ing)|announc(?:e|es|ed|ing)|unveil(?:s|ed|ing)?|debut(?:s|ed)?)\b|출시|공개|발표|선보|선봬|내놨|내놓/i.test(title);
  const excluded = /business model|pricing model|\b(?:teaser|release status|cloud expands?|now available|added to|integrat(?:es|ed|ion))\b|\b(?:cancell?\w*|scraps?|shelv\w*|postpon\w*|plans? to|consider\w*|rumou?rs?|reportedly|expected to|ahead of|shares? (?:jump|rise|fall))\b|출시\s*(?:예정|전망|취소|연기)|공개\s*(?:예정|전망|취소|연기)|출시를?\s*(?:검토|예고|취소|연기)|논문.{0,20}발표|(?:으로|로)\s*만든.{0,20}기능|(?:new|launch(?:es|ed)?|introduc(?:e|es|ing))\s+(?:a\s+)?(?:feature|app|service|tool)\b|수익\s*모델|사업\s*모델|비즈니스\s*모델|활용법|사용법|사용\s*후기|비교|요금|가격|비용|benchmark|벤치마크|평가|how to|tutorial|review|versus|\bvs\.?\b|available (?:on|in|via)\b|\bAPI\s+(?:access|pricing)\b/i.test(title);
  return target && launched && !excluded && !/출시일|발표일|release\s+date|what (?:we know|to expect)|출시\s*(?:시기|전망|예상)|공개\s*(?:시기|전망|예상)/i.test(title);
}
const kinds = { survey: /\bsurvey\b|systematic review|서베이|문헌\s*고찰/i, benchmark: /benchmark|evaluation|벤치마크|평가/i, dataset: /dataset|data set|데이터셋/i, method: /we (?:introduce|propose|present)|framework|novel|제안|새로운\s*방법/i };

export function newsSource(item) {
  return newsSources.find((source) => item.sourceId ? source.id === item.sourceId : source.name === item.source);
}

export function newsFacets(item) {
  const source = newsSource(item);
  const text = `${item.title} ${item.excerpt ?? ''} ${item.summary ?? ''} ${(item.tags ?? []).join(' ')} ${(item.paperCategories ?? []).join(' ')}`;
  const modelContext = /\bmodel\b|모델|\bLLM\b|GPT[-\d]|Claude|Gemini|Llama|Qwen|Gemma|Whisper|Voxtral|Veo|Sora|Lyria|FLUX|Mistral Large|Timestral|HyperCLOVA|Kanana|하이퍼클로바|카나나|text.to.speech|클로드|제미나이|젬마|큐웬|음성\s*(?:인식|합성)/i.test(text);
  const topics = Object.fromEntries(Object.entries(patterns).map(([group, entries]) => [group,
    group === 'models' && !modelContext ? [] : Object.entries(entries).filter(([, regex]) => regex.test(text)).map(([key]) => key)]));
  if (modelContext && !topics.models.length) topics.models.push('other');
  // 공개 방식은 자료 표현에 대한 탐색 단서다. 모델 라이선스를 검증했다는 뜻이 아니다.
  const closed = /closed.source|proprietary|not open.source|비공개|오픈소스가\s*아닌/i.test(text);
  const open = !/not open.source|오픈소스가\s*아닌/i.test(text) && /open.source|오픈소스/i.test(text);
  const weights = /open.weight|가중치\s*공개|공개\s*가중치/i.test(text);
  return { topics, openness: closed && (open || weights) ? 'unknown' : closed ? 'closed' : open ? 'open' : weights ? 'weights' : 'unknown',
    paperKinds: Object.entries(kinds).filter(([, regex]) => regex.test(text)).map(([key]) => key),
    companies: companies.filter((name) => companyPatterns[name].test(text + (source?.kind === 'developer' ? ' ' + source.name : ''))),
    origin: source?.origin ?? 'unknown', publication: source?.kind ?? 'unknown' };
}
const companyPatterns = { OpenAI: /OpenAI|오픈AI|오픈에이아이/i, Google: /Google|구글|DeepMind|딥마인드/i, Anthropic: /Anthropic|앤트로픽/i, Microsoft: /Microsoft|마이크로소프트/i, Meta: /\bMeta\b|메타/i, NVIDIA: /NVIDIA|엔비디아/i, Mistral: /Mistral|미스트랄/i, Amazon: /Amazon|\bAWS\b|아마존/i, Alibaba: /Alibaba|알리바바/i, 'Hugging Face': /Hugging Face|허깅페이스/i, xAI: /\bxAI\b|x에이아이/i, NAVER: /\bNAVER\b|네이버|하이퍼클로바|HyperCLOVA/i, '카카오': /카카오|\bkakao\b|카나나|\bKanana\b/i, '삼성전자': /삼성전자|\bSamsung Electronics\b/i, 'LG AI연구원': /LG\s*AI\s*(?:연구원|Research)/i, 'SK텔레콤': /SK\s*텔레콤|SK\s*Telecom/i, '업스테이지': /업스테이지|\bUpstage\b/i };
