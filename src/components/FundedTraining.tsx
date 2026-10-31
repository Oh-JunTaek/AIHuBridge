import { availableTraining, trainingSearchUrl } from '../data/funded-training';
import { WayfindingIcon } from './WayfindingIcon';

const searchTerms: Record<string, string> = { qa:'소프트웨어 테스트, QA', 'data-analyst':'데이터 분석, SQL', 'ai-engineer':'인공지능, 파이썬', security:'정보보안, 네트워크' };

export function FundedTraining({ careerId }: { careerId?: string }) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
  const courses = availableTraining(today, careerId);
  return <section className="funded-training" aria-labelledby="funded-training-heading">
    <div className="funded-training-header"><div><span>배움을 시작하는 또 하나의 방법</span><h2 id="funded-training-heading">국민내일배움카드 훈련</h2><p>고용24에서 AI·IT 등 직무에 필요한 훈련과정을 찾아볼 수 있어요.</p></div><a href={trainingSearchUrl} target="_blank" rel="noopener noreferrer">고용24에서 훈련 찾기 <WayfindingIcon direction="external" /></a></div>
    <div className="funded-training-guide"><p>카드 발급 가능 여부와 훈련 지원 조건은 개인별로 다릅니다. 과정마다 수강 조건·일정·본인 부담금이 다르므로 고용24와 훈련기관에서 확인하세요.</p><a href="https://m.work24.go.kr/hr/h/a/1100/selectIssuGudn.do" target="_blank" rel="noopener noreferrer">카드 발급 안내 <WayfindingIcon direction="external" /></a><a href="https://www.work24.go.kr/cm/c/f/1100/selecSystInfo.do?systClId=SC0000004&systCnntId=CI00001760&systId=SI00000356" target="_blank" rel="noopener noreferrer">K-디지털 기초역량훈련 안내 <WayfindingIcon direction="external" /></a></div>
    <div className="funded-training-examples"><h3>{careerId ? '관련 훈련과정 예시' : '살펴볼 수 있는 훈련과정 예시'}</h3>{courses.length ? <div className="funded-training-list">{courses.map((course) => <a key={course.id} href={course.url} target="_blank" rel="noopener noreferrer"><span><small>{course.category} · {course.provider}</small><strong>{course.title}</strong><small>훈련 {course.start} ~ {course.end} · {course.checked} 확인</small></span><WayfindingIcon direction="external" /></a>)}</div> : <p>현재 소개할 회차는 없습니다. 고용24에서 새로운 과정을 찾아보세요.</p>}
      <p>위 내용은 확인 당시의 과정 예시이며 실시간 모집 정보가 아닙니다. 신청 가능 여부와 다른 회차는 공식 페이지에서 확인하세요.</p>{careerId && <p>고용24 추천 검색어: <strong>{searchTerms[careerId]}</strong></p>}
    </div>
  </section>;
}
