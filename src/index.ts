import { CommonTokenStream, InputStream } from 'antlr4';
import languages from './languages';

const extentionRegExp = /\.[^.]+$/;

export function analyze(filename: string, code: string) {
  const [extention] = filename.match(extentionRegExp);
  if (!extention) {
    //
    return;
  }

  const language = languages.find(l => l.test.test(extention));
  if (!language) {
    //
    return;
  }

  const lexar = new language.lexar(new InputStream(code));
  const parser = new language.parser(new CommonTokenStream(lexar));
  parser.buildParseTrees = true;
  if (!parser[language.rules.root]) {
    //
    return;
  }
  const tree = parser[language.rules.root]();

  const walk = (ctx: any): any =>
    ctx && {
      rule: parser.ruleNames[ctx.ruleIndex],
      token: !ctx.children ? ctx.getText() : undefined,
      children: ctx.children ? ctx.children.map(child => walk(child)) : undefined,
    };

  console.log(JSON.stringify(walk(tree), undefined, 2));
}
