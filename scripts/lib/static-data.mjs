import { readFileSync } from 'node:fs';
import ts from 'typescript';

// 저장소의 타입 전용 import를 가진 정적 자료를 같은 TypeScript 컴파일러로 검사에 불러온다.
export async function loadStaticData(url) {
  const result = ts.transpileModule(readFileSync(url, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputText).toString('base64')}`);
}
