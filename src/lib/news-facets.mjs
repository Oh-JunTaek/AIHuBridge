import { newsSources } from './news-sources.mjs';

export const modelTypes = { language: '언어모델', audio: '음성·음악모델', image: '이미지모델', video: '영상모델', multimodal: '멀티모달', code: '코딩모델', robotics: '로봇·월드모델', embedding: '임베딩·검색모델', timeseries: '시계열·예측모델', other: '기타 모델' };
export const opennessLabels = { open: '오픈소스 언급', weights: '가중치 공개 언급', closed: '비공개 언급', unknown: '미확인·혼합' };
export const publicationLabels = { developer: '개발사 공식 발표', community: '커뮤니티·플랫폼', media: '매체 보도', paper: '논문 원문' };
export const topicGroups = {
  models: modelTypes,
  papers: { language: '언어·추론', vision: '시각·이미지·영상', audio: '음성·오디오', learning: '학습·최적화', agents: '에이전트·로봇', safety: '안전·평가' },
  products: { launch: '제품·기능 출시', infrastructure: '반도체·인프라', business: '투자·제휴·사업', tools: '개발 도구·API' },
  policy: { regulation: '법·규제', copyright: '저작권', privacy: '개인정보·보안', safety: '안전·거버넌스' },
  software: { model: '모델', framework: '프레임워크·라이브러리', data: '데이터셋', tool: '도구·서비스' },
  media: { report: '연구·조사 보도', interview: '인터뷰', opinion: '기고·칼럼', launch: '신제품·발표 보도' },
};
export const paperKinds = { survey: '서베이·리뷰', benchmark: '벤치마크·평가', dataset: '데이터셋', method: '방법·모델 제안' };
export const companies = ['OpenAI', 'Google', 'Anthropic', 'Microsoft', 'Meta', 'NVIDIA', 'Mistral', 'Amazon', 'Alibaba', 'Hugging Face', 'xAI'];
const patterns = {
  models: {
    language: /\b(?:LLM|language model|GPT[-\d\s]|Claude|Llama|Qwen|Gemma|Gemini|Mistral Large)\b|언어\s*모델|클로드|큐웬|제미나이|젬마|라마\s*\d/i,
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
const kinds = { survey: /\bsurvey\b|systematic review|서베이|문헌\s*고찰/i, benchmark: /benchmark|evaluation|벤치마크|평가/i, dataset: /dataset|data set|데이터셋/i, method: /we (?:introduce|propose|present)|framework|novel|제안|새로운\s*방법/i };

export function newsSource(item) {
  return newsSources.find((source) => item.sourceId ? source.id === item.sourceId : source.name === item.source);
}

export function newsFacets(item) {
  const source = newsSource(item);
  const text = `${item.title} ${item.excerpt ?? ''} ${item.summary ?? ''} ${(item.tags ?? []).join(' ')} ${(item.paperCategories ?? []).join(' ')}`;
  const modelContext = /\bmodel\b|모델|\bLLM\b|GPT[-\d]|Claude|Gemini|Llama|Qwen|Gemma|Whisper|Voxtral|Veo|Sora|Lyria|FLUX|Mistral Large|Timestral|text.to.speech|클로드|제미나이|젬마|큐웬|음성\s*(?:인식|합성)/i.test(text);
  const topics = Object.fromEntries(Object.entries(patterns).map(([group, entries]) => [group,
    group === 'models' && !modelContext ? [] : Object.entries(entries).filter(([, regex]) => regex.test(text)).map(([key]) => key)]));
  if (modelContext && !topics.models.length) topics.models.push('other');
  // 공개 방식은 기사 표현에 대한 탐색 단서다. 모델 라이선스를 검증했다는 뜻이 아니다.
  const closed = /closed.source|proprietary|not open.source|비공개|오픈소스가\s*아닌/i.test(text);
  const open = !/not open.source|오픈소스가\s*아닌/i.test(text) && /open.source|오픈소스/i.test(text);
  const weights = /open.weight|가중치\s*공개|공개\s*가중치/i.test(text);
  return { topics, openness: closed && (open || weights) ? 'unknown' : closed ? 'closed' : open ? 'open' : weights ? 'weights' : 'unknown',
    paperKinds: Object.entries(kinds).filter(([, regex]) => regex.test(text)).map(([key]) => key),
    companies: companies.filter((name) => companyPatterns[name].test(text + (source?.kind === 'developer' ? ' ' + source.name : ''))),
    origin: source?.origin ?? 'unknown', publication: source?.kind ?? 'unknown' };
}
const companyPatterns = { OpenAI: /OpenAI|오픈AI|오픈에이아이/i, Google: /Google|구글|DeepMind|딥마인드/i, Anthropic: /Anthropic|앤트로픽/i, Microsoft: /Microsoft|마이크로소프트/i, Meta: /\bMeta\b|메타/i, NVIDIA: /NVIDIA|엔비디아/i, Mistral: /Mistral|미스트랄/i, Amazon: /Amazon|\bAWS\b|아마존/i, Alibaba: /Alibaba|알리바바/i, 'Hugging Face': /Hugging Face|허깅페이스/i, xAI: /\bxAI\b|x에이아이/i };
