import { CLexer, CParser } from './grammars/C';
import { CPP14Lexer, CPP14Parser } from './grammars/CPP14';

export default [
  {
    name: 'c',
    lexar: CLexer,
    parser: CParser,
    extensions: ['.c'],
  },
  {
    name: 'cpp',
    lexar: CPP14Lexer,
    parser: CPP14Parser,
    extensions: ['.cpp'],
  },
];
