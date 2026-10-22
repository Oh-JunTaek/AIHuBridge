import { glossary } from '../data/glossary';
import type { GlossaryEntry } from '../types';

export type Question = {
  id: string;
  term: string;
  definition: string;
  options: string[]; // 섞인 용어명 후보
  answerIndex: number;
  example?: string;
  note?: string;
};

const seeded = (seed: number) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/** 오늘의 퀴즈 1건 (매일 새 문제, seed=날짜). */
export function todaysQuestion(dateStr: string): Question {
  // 날짜 문자열을 숫자 시드로 → 항상 같은 문제 나오게
  const seed = Array.from(dateStr).reduce((a, c) => a + c.charCodeAt(0), 0);
  const pool = shuffle(glossary, seed);
  const target = pool[0];
  const wrong = pool.slice(1, 4).map((e) => e.term);
  const options = shuffle([target.term, ...wrong], seed + 7);
  const answerIndex = options.indexOf(target.term);
  return {
    id: `d-${dateStr}`,
    term: target.term,
    definition: target.definition,
    options,
    answerIndex,
    example: target.example,
  };
}

export function quickQuiz(count = 8, seed = 12345): Question[] {
  const pool = shuffle(glossary, seed);
  return pool.slice(0, count).map((t, i) => {
    const wrong = pool.slice(i + 1, i + 4).map((e) => e.term);
    const options = shuffle([t.term, ...wrong], seed + i);
    return {
      id: `q-${i}`,
      term: t.term,
      definition: t.definition,
      options,
      answerIndex: options.indexOf(t.term),
      example: t.example,
      note: t.related?.join(', '),
    };
  });
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const r = seeded(seed + i);
    const j = Math.floor(r * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function randomEntry(): GlossaryEntry {
  const i = Math.floor(Math.random() * glossary.length);
  return glossary[i];
}
