import { test, expect } from '@playwright/test';
import { careers } from '../src/data/careers.ts';
import { qualifications } from '../src/data/qualifications.ts';
import { learningResources } from '../src/data/learning-resources.ts';
import { certifications } from '../src/data/certifications.ts';
import { selectCertifications } from '../src/lib/cert-rules.mjs';
import { journeys } from '../src/data/journeys.ts';

test('학습 여정의 자료와 자격증은 실제 원본을 참조한다', () => {
  for (const journey of journeys) {
    expect(careers.some((career) => career.id === journey.careerId)).toBe(true);
    for (const id of journey.qualificationIds) expect(qualifications.some((exam) => exam.id === id)).toBe(true);
    for (const step of journey.steps) for (const reference of step.resources) {
      expect(reference.reason).toBeTruthy();
      expect(learningResources.some((resource) => resource.id === reference.id)).toBe(true);
    }
  }
});

test('직무 연결은 실제 자격과 검색 결과를 가리킨다', () => {
  for (const career of careers) {
    for (const item of career.qualifications) expect(qualifications.some((exam) => exam.id === item.id)).toBe(true);
    for (const item of career.resources) {
      const url = new URL(item.url, 'https://example.test');
      const query = url.searchParams.get('query') ?? '';
      const words = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
      if (url.pathname === '/resources') expect(learningResources.some((resource) => words.every((word) => `${resource.name} ${resource.provider} ${resource.description}`.toLocaleLowerCase().includes(word)))).toBe(true);
      else if (url.pathname === '/certs') expect(selectCertifications(certifications.filter((course) => course.completionCertificateVerified), { type: 'course', query }).length).toBeGreaterThan(0);
      else throw new Error(`지원하지 않는 자료 경로: ${url.pathname}`);
    }
  }
});

test('홈과 주요 공간을 직접 열 수 있다', async ({ page }) => {
  const routes = [
    ['', 'AI의 세계로'], ['dashboard', 'AI 소식 한눈에'], ['updates', 'AI 소식'],
    ['calendar', 'AI 캘린더'], ['social', '기업 SNS'], ['path', '추천 커리큘럼'],
    ['resources', '학습 자료실'], ['certs', '수료증 취득 강의'], ['qualifications', '자격증 도전'],
    ['learning', '학습관'], ['information', '정보관'], ['careers', '직무 둘러보기'],
  ];
  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1, name: new RegExp(heading) })).toBeVisible();
  }
});

test('목적은 필수이며 분야는 선택으로 여정을 바꾸고 국비 훈련은 직무 경로에 제공한다', async ({ page }) => {
  await page.goto('path');
  await expect(page.getByRole('region', { name: '선택한 학습 여정' })).toHaveCount(0);
  await page.getByRole('button', { name: /새로운 직무에 도전/ }).click();
  await expect(page.getByRole('heading', { name: '데이터 분석', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '소프트웨어 QA', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '소프트웨어 QA', exact: true }).click();
  await expect(page.getByRole('heading', { name: '데이터 분석', exact: true })).toHaveCount(0);
  await expect(page.getByText('테스트 조건, 기대 결과와 실제 결과를 담은 테스트 보고서를 작성해 보세요.')).toBeVisible();
  await expect(page.getByRole('heading', { name: '국민내일배움카드 훈련' })).toBeVisible();
  await page.getByRole('button', { name: '데이터 분석', exact: true }).click();
  await expect(page.getByRole('heading', { name: '데이터 분석', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '소프트웨어 QA', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '데이터 분석', exact: true }).click();
  await page.getByRole('button', { name: /직접 만들고 활용/ }).click();
  await expect(page.getByText(/직접 만든 페이지나 연습용 웹사이트/)).toBeVisible();
  await expect(page.getByRole('heading', { name: '국민내일배움카드 훈련' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Playwright 테스트 작성/ })).toHaveAttribute('href', /resources\?query=/);
});

test('이동 표식과 제목은 함께 반응하고 모션 축소 설정을 따른다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('dashboard');
  const link = page.getByRole('complementary', { name: '대시보드 빠른 이동' }).getByRole('link', { name: 'AI 소식', exact: true });
  await link.hover();
  await expect.poll(() => link.locator('span').evaluate((element) => getComputedStyle(element).transform)).toBe('matrix(1.035, 0, 0, 1.035, 0, 0)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(link.locator('span')).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('');
  const card = page.locator('.exhibit-card.is-centered');
  await expect(card).toHaveCount(1);
  await card.hover();
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element).transform)).toBe('matrix(1.035, 0, 0, 1.035, 0, 0)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('개인정보 문의 안내와 이미지 대체 텍스트를 제공한다', async ({ page }) => {
  await page.goto('privacy');
  await expect(page.getByText(/보낸 사람의 주소와 문의 내용/)).toBeVisible();
  await expect(page.getByText(/열람·정정·삭제 요청/)).toBeVisible();
  for (const route of ['', 'qualifications', 'resources', 'certs']) {
    await page.goto(route);
    expect(await page.locator('img:not([alt])').count()).toBe(0);
  }
  await page.goto('qualifications');
  await expect(page.locator('.qualification-emblem').first()).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.qualification-card img')).toHaveCount(0);
});

test('자격증 카드의 상세 창과 공식 링크가 열린다', async ({ page }) => {
  await page.goto('qualifications');
  await page.getByRole('button', { name: /데이터분석 준전문가/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: /데이터분석 준전문가/ })).toBeVisible();
  await expect(dialog.getByRole('link', { name: /공식홈페이지 방문/ })).toHaveAttribute('href', /dataq\.or\.kr/);
  await dialog.getByRole('button', { name: '상세 안내 닫기' }).click();
  await expect(dialog).not.toBeVisible();
});

test('QA 자격과 학습 자료·수료 과정을 구분해 찾는다', async ({ page }, testInfo) => {
  await page.goto('qualifications');
  if (testInfo.project.name === 'mobile') await page.getByText('탐색 조건', { exact: false }).first().click();
  await page.getByRole('button', { name: 'QA', exact: true }).click();
  await page.getByRole('button', { name: /ISTQB Certified Tester AI Testing/ }).click();
  await expect(page.getByRole('dialog').getByText(/CTFL 자격 보유 필수/)).toBeVisible();
  await page.keyboard.press('Escape');
  await page.goto('resources');
  if (testInfo.project.name === 'mobile') await page.getByText('탐색 조건', { exact: false }).first().click();
  await page.getByLabel('자료·기관 검색').fill('QA');
  await expect(page.getByRole('button', { name: /Playwright 테스트 작성/ })).toBeVisible();
  await page.goto('certs');
  if (testInfo.project.name === 'mobile') await page.getByText('탐색 조건', { exact: false }).first().click();
  await page.getByLabel('교육·기관 검색').fill('QA');
  await page.getByRole('button', { name: /Introduction to Software Testing/ }).click();
  await expect(page.getByRole('dialog').getByText(/수료증·평가 비용 · 유료/)).toBeVisible();
});

test('분야 태그 색상과 왼쪽 필터 열 너비가 일관된다', async ({ page }, testInfo) => {
  await page.goto('qualifications');
  if (testInfo.project.name === 'mobile') await page.getByText('탐색 조건', { exact: false }).first().click();
  const tags = page.locator('.qualification-tags [data-category="QA"]');
  const colors = await tags.evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).backgroundColor));
  expect(colors.length).toBeGreaterThan(1);
  expect(new Set(colors).size).toBe(1);
  for (const [route, selector] of [
    ['qualifications', '.qualification-category > div'],
    ['updates', 'nav[aria-label="소식 분야"]'],
    ['resources', '[aria-label="자료 유형"]'],
  ]) {
    await page.goto(route);
    if (testInfo.project.name === 'mobile') await page.getByText('탐색 조건', { exact: false }).first().click();
    const layout = await page.locator(selector).evaluate((node) => {
      const buttons = [...node.querySelectorAll('button')];
      return { grid: getComputedStyle(node).display, widths: buttons.slice(0, 2).map((button) => button.getBoundingClientRect().width), overflow: buttons.some((button) => button.scrollWidth > button.clientWidth + 1) };
    });
    expect(layout.grid).toBe('grid');
    expect(Math.abs(layout.widths[0] - layout.widths[1])).toBeLessThan(1);
    expect(layout.overflow).toBe(false);
  }
});

test('소식의 상세 필터가 열리고 조건을 적용할 수 있다', async ({ page }, testInfo) => {
  await page.goto('updates');
  if (testInfo.project.name === 'mobile') await page.getByText('탐색 조건', { exact: false }).first().click();
  await page.getByText('상세 조건', { exact: false }).click();
  await page.getByLabel('자료 언어').selectOption('ko');
  await expect(page.getByText(/상세 조건 · 1개 적용/)).toBeVisible();
});

test('학습 자료 검색과 수료 강의 공식 링크를 유지한다', async ({ page }, testInfo) => {
  await page.goto('resources');
  if (testInfo.project.name === 'mobile') await page.getByText('탐색 조건', { exact: false }).first().click();
  await page.getByLabel('자료·기관 검색').fill('Pandas');
  await page.getByRole('button', { name: /Pandas/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Pandas', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link', { name: /Pandas 공식 페이지/ })).toHaveAttribute('href', /kaggle\.com/);
  await page.getByRole('dialog').getByRole('button', { name: '상세 안내 닫기' }).click();
  await page.goto('certs');
  await page.getByRole('button', { name: /Hugging Face Agents Course/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Hugging Face Agents Course' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link', { name: /Hugging Face Agents Course 공식 페이지/ })).toHaveAttribute('href', /huggingface\.co/);
  await expect(page.getByRole('dialog').getByText(/수료증·평가 비용/)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('캐러셀은 복제 링크를 숨기고 키보드로 이동한다', async ({ page }) => {
  await page.goto('');
  const carousel = page.getByRole('region', { name: '전시 공간 목록' });
  await expect(carousel.getByRole('link')).toHaveCount(11);
  await carousel.focus();
  await page.keyboard.press('ArrowRight');
  await expect(carousel.locator('.is-centered h3')).toHaveText('AI 캘린더');
  await page.keyboard.press('ArrowLeft');
  await expect(carousel.locator('.is-centered h3')).toHaveText('AI 소식');
});

test('직무에서 학습 자료와 자격 상세로 연결하고 채용행사 출처를 안내한다', async ({ page }, testInfo) => {
  await page.goto('careers');
  await expect(page.getByRole('link', { name: /고용24 채용행사 찾아보기/ })).toHaveAttribute('href', 'https://www.work24.go.kr/');
  await page.getByRole('link', { name: /소프트웨어 QA·테스터/ }).click();
  await expect(page.getByRole('heading', { name: '소프트웨어 QA·테스터' })).toBeVisible();
  await page.getByRole('link', { name: /QA 기초 자료 살펴보기/ }).click();
  if (testInfo.project.name === 'mobile') await page.getByText('탐색 조건', { exact: false }).first().click();
  await expect(page.getByLabel('자료·기관 검색')).toHaveValue('QA');
  await expect(page.getByRole('button', { name: /Playwright 테스트 작성/ })).toBeVisible();
  await page.goto('careers/qa');
  await page.getByRole('link', { name: /ISTQB CTFL 기초 자격/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: /CTFL/ })).toBeVisible();
  await page.goto('careers/없는직무');
  await expect(page.getByRole('heading', { name: '직무를 찾을 수 없습니다' })).toBeVisible();
});

test('국민내일배움카드 과정은 직무와 시작일에 맞게 안내한다', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-31T03:00:00Z'));
  await page.goto('careers/data-analyst');
  const training = page.locator('.funded-training');
  await expect(training.getByRole('link', { name: /입문자를 위한 파이썬/ })).toHaveAttribute('href', /work24\.go\.kr/);
  await expect(training.getByText(/실시간 모집 정보가 아닙니다/)).toBeVisible();
  await page.goto('careers/qa');
  await expect(training.getByText(/현재 소개할 회차는 없습니다/)).toBeVisible();
  await expect(training.getByText(/소프트웨어 테스트, QA/)).toBeVisible();
  await page.clock.setFixedTime(new Date('2026-11-05T03:00:00Z'));
  await page.goto('careers/data-analyst');
  await expect(training.getByText(/현재 소개할 회차는 없습니다/)).toBeVisible();
  await expect(training.getByRole('link', { name: /고용24에서 훈련 찾기/ })).toHaveAttribute('href', /work24\.go\.kr/);
});

test('상위 메뉴에서 각 공간 소개와 하위 페이지로 이동한다', async ({ page }) => {
  await page.goto('dashboard');
  const nav = page.getByRole('navigation', { name: '주요 메뉴' });
  await nav.getByRole('link', { name: '학습관', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: '학습관' })).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: /추천 커리큘럼/ })).toHaveAttribute('href', /\/path$/);
  await page.locator('main').getByRole('link', { name: /학습 자료실/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: '학습 자료실' })).toBeVisible();
  await nav.getByRole('link', { name: '정보관', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: '정보관' })).toBeVisible();
  await page.locator('main').getByRole('link', { name: /AI 캘린더/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'AI 캘린더' })).toBeVisible();
  await nav.getByRole('link', { name: '홈', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: /AI의 세계로/ })).toBeVisible();
});

test('상세 창은 닫기 효과를 마친 뒤 닫히며 포커스를 돌려준다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('qualifications');
  const card = page.getByRole('button', { name: /데이터분석 준전문가/ });
  await card.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveClass(/is-closing/);
  await expect(dialog).not.toBeVisible();
  await expect(card).toBeFocused();
});
