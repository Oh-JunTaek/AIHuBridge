import { test, expect } from '@playwright/test';

test('홈과 주요 공간을 직접 열 수 있다', async ({ page }) => {
  const routes = [
    ['', 'AI의 세계로'], ['dashboard', 'AI 소식 한눈에'], ['updates', 'AI 소식'],
    ['calendar', 'AI 캘린더'], ['social', '기업 SNS'], ['path', '추천 커리큘럼'],
    ['resources', '학습 자료실'], ['certs', '수료증 취득 강의'], ['qualifications', '자격증 도전'],
    ['learning', '학습관'], ['information', '정보관'],
  ];
  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1, name: new RegExp(heading) })).toBeVisible();
  }
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
  await expect(carousel.getByRole('link')).toHaveCount(10);
  await carousel.focus();
  await page.keyboard.press('ArrowRight');
  await expect(carousel.locator('.is-centered h3')).toHaveText('AI 캘린더');
  await page.keyboard.press('ArrowLeft');
  await expect(carousel.locator('.is-centered h3')).toHaveText('AI 소식');
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
