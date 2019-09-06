import { CommonTokenStream, InputStream } from 'antlr4/index';
import languages from './languages';

const extentionRegExp = /\.[^.]+$/;

export async function analyze(filename: string, code: string): Promise<Result> {
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
  if (language.rules.root.length !== 1 || typeof parser[language.rules.root[0].rule] !== 'function') {
    //
    return;
  }
  const tree = parser[language.rules.root[0].rule]();

  // const walk = (ctx: any): any =>
  //   ctx && {
  //     rule: parser.ruleNames[ctx.ruleIndex],
  //     token: !ctx.children ? ctx.getText() : undefined,
  //     children: ctx.children ? ctx.children.map(child => walk(child)) : undefined,
  //   };

  const result: Result = {
    files: [
      {
        name: filename,
        ccn: 1,
      },
    ],
    functions: [],
  };
  let nestedFunctionCount = 0;
  const walk = (ctx: any): any => {
    if (!ctx) {
      return;
    }

    const isFunctionDefinition =
      language.rules.functionDefinition.find(
        r =>
          (r.rule === undefined || r.rule === parser.ruleNames[ctx.ruleIndex]) &&
          (r.token === undefined || r.token === ctx.getText())
      ) !== undefined;
    const isCcnIncrement =
      language.rules.ccnIncrement.find(
        r =>
          (r.rule === undefined || r.rule === parser.ruleNames[ctx.ruleIndex]) &&
          (r.token === undefined || r.token === ctx.getText())
      ) !== undefined;

    if (isFunctionDefinition) {
      nestedFunctionCount++;
      if (nestedFunctionCount === 1) {
        result.functions.push({
          name: '',
          ccn: 1,
        });
      }
    }
    if (nestedFunctionCount > 0 && isCcnIncrement) {
      result.functions[result.functions.length - 1].ccn++;
      result.files[0].ccn++;
    }

    if (Array.isArray(ctx.children)) {
      ctx.children.forEach(child => walk(child));
    }

    if (isFunctionDefinition) {
      nestedFunctionCount--;
    }
  };

  walk(tree);

  return result;
}

interface Result {
  files: [ResultNode];
  functions: ResultNode[];
}

interface ResultNode {
  name: string;
  ccn: number;
}
