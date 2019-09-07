import { CLexer, CParser, CPP14Lexer, CPP14Parser } from './grammars';

const languages: LanguageConfig[] = [
  {
    test: /\.c$/,
    name: 'c',
    lexar: CLexer,
    parser: CParser,
    selectors: {
      root: [['compilationUnit']],
      functionDefinition: [['functionDefinition']],
      functionName: [['functionDefinition', 'declarator', 'directDeclarator', 'directDeclarator', undefined]],
      ccnIncrement: [["'if'"], ["'while'"], ["'case'"], ["'&&'"], ["'||'"], ["'?'"]],
    },
  },
  {
    test: /\.cpp$/,
    name: 'cpp',
    lexar: CPP14Lexer,
    parser: CPP14Parser,
    selectors: {
      root: [['translationunit']],
      functionDefinition: [['functiondefinition']],
      functionName: [
        [
          'functiondefinition',
          'declarator',
          'ptrdeclarator',
          'noptrdeclarator',
          'noptrdeclarator',
          'declaratorid',
          'idexpression',
          'unqualifiedid',
          undefined,
        ],
      ],
      ccnIncrement: [["'if'"], ["'while'"], ["'case'"], ["'&&'"], ["'and'"], ["'||'"], ["'or'"], ["'?'"]],
    },
  },
];

export interface LanguageConfig {
  test: RegExp;
  name: string;
  lexar: any;
  parser: any;
  selectors: {
    root: [Selector];
    functionDefinition: Selector[];
    functionName: Selector[];
    ccnIncrement: Selector[];
  };
}

export type Selector = string[];

export default languages;
