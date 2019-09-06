import { CLexer, CParser } from './grammars/C';
import { CPP14Lexer, CPP14Parser } from './grammars/CPP14';

const languages: LanguageConfig[] = [
  {
    test: /\.c$/,
    name: 'c',
    lexar: CLexer,
    parser: CParser,
    rules: {
      root: [{ rule: 'compilationUnit' }],
      functionDefinition: [{ rule: 'functionDefinition' }],
      ccnIncrement: [
        { token: 'if' },
        { token: 'while' },
        { token: 'case' },
        { token: '&&' },
        { token: '||' },
        { token: '?' },
      ],
    },
  },
  {
    test: /\.cpp$/,
    name: 'cpp',
    lexar: CPP14Lexer,
    parser: CPP14Parser,
    rules: {
      root: [{ rule: 'translationunit' }],
      functionDefinition: [{ rule: 'functiondefinition' }],
      ccnIncrement: [
        { token: 'if' },
        { token: 'while' },
        { token: 'case' },
        { token: '&&' },
        { token: 'and' },
        { token: '||' },
        { token: 'or' },
        { token: '?' },
      ],
    },
  },
];

interface LanguageConfig {
  test: RegExp;
  name: string;
  lexar: any;
  parser: any;
  rules: {
    root: Rule[];
    functionDefinition: Rule[];
    ccnIncrement: Rule[];
  };
}

interface Rule {
  rule?: string;
  token?: string;
}

export default languages;
