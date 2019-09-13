import { Lexer, Parser, CharStream, TokenStream } from 'antlr4ts';
import { CLexer, CParser, CPP14Lexer, CPP14Parser } from './grammars';
import { Selector } from './Selector';

export const languages: Language[] = [
  {
    test: /\.c$/,
    name: 'c',
    lexar: CLexer,
    parser: CParser,
    root: 'compilationUnit',
    selectors: {
      functionDefinition: ['functionDefinition'],
      functionName: ['functionDefinition > declarator > directDeclarator > directDeclarator > *'],
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
      functionDefinition: ['functiondefinition', 'lambdaexpression'],
      functionName: ['functiondefinition > declarator unqualifiedid > *'],
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
  // TODO: refactor
  cachedSelectors?: {
    functionDefinition: Selector[];
    functionName: Selector[];
    ccnIncrement: Selector[];
  };
}
