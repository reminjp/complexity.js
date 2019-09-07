import languages from './languages';
import { Parser } from './Parser';
import { Result, Analyzer } from './Analyzer';

export { Result, ResultUnit } from './Analyzer';

const extentionRegExp = /\.[^.]+$/;

export async function analyze(filename: string, code: string): Promise<Result> {
  const [extention] = filename.match(extentionRegExp);
  if (!extention) {
    throw 'failed to detect a file extention';
  }

  const language = languages.find(l => l.test.test(extention));
  if (!language) {
    throw `unsupported language '${extention}'`;
  }

  const tree = new Parser(language).parse(code);
  const result = new Analyzer(language).analyze(tree);
  result.files[0].name = filename;
  return result;
}
