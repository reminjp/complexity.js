import { ANTLRInputStream, CommonTokenStream, ParserRuleContext } from 'antlr4ts';
import languages, { Selector } from './Language';
import { Visitor } from './Visitor';

const extentionRegExp = /\.[^.]+$/;

export async function analyze(filename: string, code: string): Promise<any> {
  const [extention] = filename.match(extentionRegExp);
  if (!extention) {
    throw 'failed to detect a file extention';
  }

  const language = languages.find(l => l.test.test(extention));
  if (!language) {
    throw `unsupported language '${extention}'`;
  }

  const lexar = new language.lexar(new ANTLRInputStream(code));
  const parser = new language.parser(new CommonTokenStream(lexar));

  Selector.addLanguage(language.name, parser.ruleNames);
  if (language.cachedSelectors === undefined) {
    language.cachedSelectors = {
      functionDefinition: language.selectors.functionDefinition.map(s => new Selector(language.name, s)),
      functionName: language.selectors.functionName.map(s => new Selector(language.name, s)),
      ccnIncrement: language.selectors.ccnIncrement.map(s => new Selector(language.name, s)),
    };
  }

  const context: ParserRuleContext = parser[language.root]();
  const visitor = new Visitor(language, parser);
  visitor.visit(context);
  const result = visitor.getResult();
  result.files[0].name = filename;
  return result;
}
