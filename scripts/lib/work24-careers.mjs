import { parseStringPromise } from 'xml2js';
import { Work24Error, safeResponseShape, safeResponseCategory } from './work24-errors.mjs';

const origin = 'https://www.work24.go.kr';
const queries = [
  { id: 'qa', job: '소프트웨어 테스터', duty: '소프트웨어 테스트' },
  { id: 'data-analyst', job: '데이터 분석', duty: '데이터 분석' },
  { id: 'ai-engineer', job: '인공지능', duty: '인공지능' },
  { id: 'security', job: '정보보안', duty: '정보보안' },
];
const list = (value) => value == null ? [] : Array.isArray(value) ? value : [value];
const clean = (value, max = 300) => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '';

async function request(path, key, params, format, fetcher) {
  if (!key) throw new Work24Error('missing_key');
  const url = new URL(path, origin);
  url.search = new URLSearchParams({ authKey: key, ...params }).toString();
  let response, body;
  try { response = await fetcher(url, { signal: AbortSignal.timeout(15000) }); }
  catch { throw new Work24Error('network_error'); }
  if (!response.ok) throw new Work24Error('http_error', response.status);
  try { body = await response.text(); } catch { throw new Work24Error('network_error'); }
  if (body.length > 4 * 1024 * 1024 || /<!DOCTYPE|<!ENTITY/i.test(body)) throw new Work24Error('unsafe_response');
  try { return format === 'xml' ? await parseStringPromise(body, { explicitArray: false, trim: true }) : JSON.parse(body); }
  catch { throw new Work24Error('invalid_response'); }
}

export function parseJobs(data) {
  const root = data?.jobsList;
  if (!root || !/^\d+$/.test(String(root.total ?? ''))) throw new Work24Error('schema_error', undefined, safeResponseShape(data, 'jobsList', 'total'), safeResponseCategory(data));
  const rows = list(root.jobList);
  if (Number(root.total) > 0 && !rows.length) throw new Work24Error('missing_rows');
  return rows.flatMap((item) => {
    const name = clean(item.jobNm, 100), code = clean(item.jobCd, 40);
    return name && code ? [{ name, code }] : [];
  }).slice(0, 6);
}

export function parseDuties(data) {
  if (!data || typeof data.result !== 'object' || data.result === null || Array.isArray(data.result)) throw new Work24Error('schema_error');
  return Object.values(data.result).flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const name = clean(entry.job_sdvn, 100);
    return name ? [{ name, category: clean(entry.job_scfn, 100) }] : [];
  }).slice(0, 5);
}

export function parseCodes(data) {
  const root = data?.HRDNet;
  if (!root || !/^\d+$/.test(String(root.scn_cnt ?? ''))) throw new Work24Error('schema_error');
  const rows = list(root.srchList?.scn_list);
  if (Number(root.scn_cnt) > 0 && !rows.length) throw new Work24Error('missing_rows');
  return rows.flatMap((item) => {
    const code = clean(item.rsltCode, 30), name = clean(item.rsltName, 100);
    return code && name && item.useYn !== 'N' ? [{ code, name }] : [];
  });
}

function parseDate(value) {
  const match = String(value ?? '').match(/^(\d{4})[.\-/]?(\d{2})[.\-/]?(\d{2})$/);
  if (!match) return null;
  const d = `${match[1]}-${match[2]}-${match[3]}`;
  const parsed = new Date(`${d}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().startsWith(d) ? d : null;
}

export function parseEvents(data, today) {
  const root = data?.empEventList;
  if (!root || !/^\d+$/.test(String(root.total ?? ''))) throw new Work24Error('schema_error', undefined, safeResponseShape(data, 'empEventList', 'total'), safeResponseCategory(data));
  const rows = list(root.empEvent);
  if (Number(root.total) > 0 && !rows.length) throw new Work24Error('missing_rows');
  return rows.flatMap((row) => {
    const id = clean(row.eventNo, 40), name = clean(row.eventNm, 180), area = clean(row.area, 80);
    const dates = String(row.eventTerm ?? '').match(/\d{4}[.\-/]\d{2}[.\-/]\d{2}|\b\d{8}\b/g) ?? [];
    const start = parseDate(dates[0]), end = parseDate(dates[1] ?? dates[0]);
    if (!id || !name || !start || !end || end < start || end < today) return [];
    return [{ id, name, area, start, end }];
  });
}

export async function collectJobs(key, fetcher = fetch) {
  const result = {};
  for (const query of queries) {
    const xml = await request('/cm/openApi/call/wk/callOpenApiSvcInfo212L01.do', key, { returnType:'XML', target:'JOBCD', srchType:'K', keyword:query.job }, 'xml', fetcher);
    result[query.id] = { query: query.job, items: parseJobs(xml) };
  }
  return result;
}

export async function collectDuties(key, fetcher = fetch) {
  const result = {};
  for (const query of queries) {
    const json = await request('/cm/openApi/call/wk/callOpenApiSvcInfo215L11.do', key, { returnType:'JSON', word:query.duty, limit:'5' }, 'json', fetcher);
    result[query.id] = { query: query.duty, items: parseDuties(json) };
  }
  return result;
}

export async function collectCodes(key, fetcher = fetch) {
  const result = {};
  for (const [type, name] of [['00','regions'], ['05','ncs']]) {
    const xml = await request('/cm/openApi/call/hr/callOpenApiSvcInfo319L01.do', key, { returnType:'XML', outType:'1', srchType:type }, 'xml', fetcher);
    result[name] = parseCodes(xml);
  }
  return result;
}

export async function collectEvents(key, today, fetcher = fetch) {
  const result = new Map();
  for (let page = 1; page <= 10; page++) {
    const xml = await request('/cm/openApi/call/wk/callOpenApiSvcInfo210L11.do', key, { returnType:'XML', callTp:'L', startPage:String(page), display:'100' }, 'xml', fetcher);
    const rows = parseEvents(xml, today);
    for (const event of rows) result.set(event.id, event);
    if (page * 100 >= Number(xml.empEventList.total)) break;
    if (page === 10) throw new Work24Error('page_limit');
  }
  return [...result.values()].sort((a, b) => a.start.localeCompare(b.start));
}
