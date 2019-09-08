import { Lexer, Parser, CharStream, TokenStream } from 'antlr4ts';
import { RuleNode, TerminalNode } from 'antlr4ts/tree';
import { CLexer, CParser, CPP14Lexer, CPP14Parser } from './grammars';

const languages: Language[] = [
  {
    test: /\.c$/,
    name: 'c',
    lexar: CLexer,
    parser: CParser,
    root: 'compilationUnit',
    selectors: {
      functionDefinition: ['functionDefinition'],
      functionName: ['functionDefinition declarator directDeclarator directDeclarator *'],
      ccnIncrement: ["'if'", "'while'", "'case'", "'&&'", "'||'", "'?'"],
    },
  },
  {
    test: /\.cpp$/,
    name: 'cpp',
    lexar: CPP14Lexer,
    parser: CPP14Parser,
    root: 'translationunit',
    selectors: {
      functionDefinition: ['functiondefinition'],
      functionName: [
        'functiondefinition declarator ptrdeclarator noptrdeclarator noptrdeclarator declaratorid idexpression unqualifiedid *',
      ],
      ccnIncrement: ["'if'", "'while'", "'case'", "'&&'", "'and'", "'||'", "'or'", "'?'"],
    },
  },
];

export interface Language {
  test: RegExp;
  name: string;
  lexar: new (input: CharStream) => Lexer;
  parser: new (input: TokenStream) => Parser;
  root: string;
  selectors: {
    functionDefinition: string[];
    functionName: string[];
    ccnIncrement: string[];
  };
  cachedSelectors?: {
    functionDefinition: Selector[];
    functionName: Selector[];
    ccnIncrement: Selector[];
  };
}

export class Selector {
  private static languages = new Set<string>();
  private static ruleIndices = new Map<string, number>();

  public static addLanguage(name: string, ruleNames: string[]) {
    if (Selector.languages.has(name)) {
      return;
    }

    ruleNames.forEach((ruleName, index) => {
      Selector.ruleIndices.set(`${name} ${ruleName}`, index);
    });
  }

  private elements: (number | string)[];

  constructor(languageName: string, stringExpression: string) {
    const tokens = stringExpression.trim().split(/\s+/);

    if (tokens.length === 0) {
      throw 'empty selector';
    }

    this.elements = tokens
      .map(token => {
        if (token === '*') {
          return undefined;
        } else if (/'.+'/.test(token)) {
          return token.substring(1, token.length - 1);
        } else {
          const ruleIndex = Selector.ruleIndices.get(`${languageName} ${token}`);
          if (ruleIndex === undefined) {
            throw `found unknown rule name in a selector: ${stringExpression}`;
          }
          return ruleIndex;
        }
      })
      .reverse();
  }

  public match(node: RuleNode | TerminalNode): boolean {
    if (
      !(
        this.elements[0] === undefined ||
        (node instanceof RuleNode && node.ruleContext.ruleIndex === this.elements[0]) ||
        (node instanceof TerminalNode && node.text === this.elements[0])
      )
    ) {
      return false;
    }

    let elementIndex = 1;
    for (let n = node; n !== undefined && elementIndex < this.elements.length; n = n.parent) {
      if (
        this.elements[elementIndex] === undefined ||
        (n instanceof RuleNode && n.ruleContext.ruleIndex === this.elements[elementIndex]) ||
        (n instanceof TerminalNode && n.text === this.elements[elementIndex])
      ) {
        elementIndex++;
      }
    }
    return elementIndex === this.elements.length;
  }
}

export default languages;
