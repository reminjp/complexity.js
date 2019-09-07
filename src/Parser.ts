import { CommonTokenStream, InputStream } from 'antlr4/index';
import { LanguageConfig } from './languages';

export class Parser {
  private language: LanguageConfig;
  private ruleNames: string[];

  constructor(language: LanguageConfig) {
    this.language = language;
  }

  public parse(code: string) {
    const lexar = new this.language.lexar(new InputStream(code));
    const parser = new this.language.parser(new CommonTokenStream(lexar));
    this.ruleNames = parser.ruleNames;
    parser.buildParseTrees = true;
    const context = parser[this.language.selectors.root[0][0]]();
    const tree = this.antlrContextToParseTree(context);

    // let log = '';
    // let depth = 0;
    // const dfs = (node: ParseTree) => {
    //   log += `${'  '.repeat(depth)}${node.symbol}\n`;
    //   depth++;
    //   node.children.forEach(child => dfs(child));
    //   depth--;
    // };
    // dfs(tree);
    // console.log(log);

    return tree;
  }

  private antlrContextToParseTree(ctx: any): ParseTree {
    if (!ctx) {
      return undefined;
    }

    const children: ParseTree[] = (ctx.children || []).filter(c => !!c).map(c => this.antlrContextToParseTree(c));

    const tree: ParseTree = {
      symbol: children.length === 0 ? `'${ctx.getText()}'` : this.ruleNames[ctx.ruleIndex],
      text: ctx.getText(),
      children,
    };
    tree.children.forEach(c => {
      c.parent = tree;
    });

    return tree;
  }
}

export interface ParseTree {
  symbol: string;
  text: string;
  parent?: ParseTree;
  children: ParseTree[];
}
