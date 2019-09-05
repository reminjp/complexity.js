import { CLexer, CParser } from './grammars/C';
import { CPP14Lexer, CPP14Parser } from './grammars/CPP14';

export default [
  {
    test: /\.c$/,
    name: 'c',
    lexar: CLexer,
    parser: CParser,
    rules: { root: 'primaryExpression' },
  },
  {
    test: /\.cpp$/,
    name: 'cpp',
    lexar: CPP14Lexer,
    parser: CPP14Parser,
    rules: { root: 'translationunit' },
  },
];
