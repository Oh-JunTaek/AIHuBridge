// 고용24에서 확인한 개별 회차의 참고 정보. 모집 여부·본인 부담금은 원문에서 다시 확인한다.
export const trainingSearchUrl = 'https://www.work24.go.kr/hr/a/a/1100/trnnCrsInf.do?action=trnnCrsIn&area=&crseTracseSe=&currentMenuId=EBG020000000308&gvrnInstt=&menuPurpSecd=&ncs=&programMenuIdentification=EBG020000001862&redirectUrl=%2Fa%2Fa%2F1100%2FtrnnCrsInfPost.do&selectNCSKeyword=&topArea=';
export const fundedTraining = [
  { id:'aice-14', title:'AI 엔지니어 입문, 데이터 가공부터 AICE 자격 취득까지', provider:'데이원컴퍼니', category:'K-디지털 기초역량훈련', start:'2026-11-04', end:'2026-12-09', checked:'2026-10-31', careers:['ai-engineer','data-analyst'], url:'https://www.work24.go.kr/hr/a/a/3100/selectTracseDetl1.do?crseTracseSe=500037441805&cstmConsTme=&focusId=&tracseId=AIG20260000544634&tracseReqstsCd=&tracseTme=14&trainstCstmrId=C0105' },
  { id:'python-83', title:'입문자를 위한 파이썬 응용 프로젝트 구현하기', provider:'에스디(SD)부트캠프평생교육원', category:'K-디지털 기초역량훈련', start:'2026-11-04', end:'2026-12-03', checked:'2026-10-31', careers:['ai-engineer','data-analyst'], url:'https://www.work24.go.kr/hr/a/a/3100/selectTracseDetl.do?crseTracseSe=C0105&tracseId=AIG20240000499162&tracseTme=83&trainstCstmrId=500034091717' },
  { id:'ai-data-32', title:'처음부터 제대로 배우는 AI 기초 (feat. 직무별 현업 데이터 분석 실습)', provider:'윈스펙원격평생교육원', category:'K-디지털 기초역량훈련', start:'2026-11-04', end:'2026-12-04', checked:'2026-10-31', careers:['ai-engineer','data-analyst'], url:'https://m.work24.go.kr/hr/a/a/3100/selectTracseDetl.do?crseTracseSe=C0105&tracseId=AIG20260000545336&tracseTme=32&trainstCstmrId=500034225481' },
] as const;

export function availableTraining(today: string, careerId?: string) {
  return fundedTraining.filter((course) => course.start >= today && (!careerId || (course.careers as readonly string[]).includes(careerId)));
}
