import { CommonTokenStream, InputStream } from 'antlr4/index';
import languages from './languages';

const extentionRegExp = /\.[^.]+$/;

export function analyze(filename: string, code: string) {
  const [extention] = filename.match(extentionRegExp);
  if (extention === undefined) {
    //
    return;
  }

  const language = languages.find(l => l.extensions.findIndex(e => e === extention));
  if (language === undefined) {
    //
    return;
  }

  const lexar = new language.lexar(new InputStream(code));
  const parser = new language.parser(new CommonTokenStream(lexar));
  parser.buildParseTrees = true;
  const tree = parser.translationunit();

  console.log(tree);
}
