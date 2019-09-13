import { ParseTreeVisitor, ParseTree, RuleNode, TerminalNode } from 'antlr4ts/tree';
import { Parser, ParserRuleContext } from 'antlr4ts';
import { Language } from './Language';

export class Visitor implements ParseTreeVisitor<void> {
  private language: Language;
  private ruleIndices: Map<string, number>;

  private functionStack: number[];

  private result: FileResult;

  constructor(language: Language, parser: Parser) {
    this.language = language;

    this.ruleIndices = new Map();
    parser.ruleNames.forEach((ruleName, index) => {
      this.ruleIndices.set(ruleName, index);
    });
  }

  getResult() {
    return this.result;
  }

  visit(tree: ParseTree): void {
    this.functionStack = [];

    this.result = {
      name: '',
      loc: 0,
      cc: 1,
      functions: [],
    };

    tree.accept(this);
  }

  // The node is typed as RuleNode but it is ParserRuleContext in fact.
  visitChildren(node: RuleNode | ParserRuleContext): void {
    const isFunctionDefinition =
      this.language.cachedSelectors &&
      this.language.cachedSelectors.functionDefinition.find(s => s.match(node)) !== undefined;

    if (isFunctionDefinition) {
      this.functionStack.push(this.result.functions.length);

      this.result.functions.push({
        name: '',
        loc: 'start' in node && 'stop' in node ? node.stop.line + 1 - node.start.line : 0,
        cc: 1,
      });
    }

    for (let i = 0; i < node.childCount; i++) {
      node.getChild(i).accept(this);
    }

    if (isFunctionDefinition) {
      this.functionStack.pop();
    }
  }

  visitTerminal(node: TerminalNode): void {
    if (this.language.cachedSelectors) {
      if (this.language.cachedSelectors.functionName.find(s => s.match(node)) !== undefined) {
        this.result.functions[this.functionStack[this.functionStack.length - 1]].name = node.text;
      }
      if (this.language.cachedSelectors.ccnIncrement.find(s => s.match(node)) !== undefined) {
        if (this.functionStack.length > 0) {
          this.result.functions[this.functionStack[this.functionStack.length - 1]].cc++;
        } else {
          this.result.cc++;
        }
      }
    }
  }

  visitErrorNode(): void {}
  // visitErrorNode(node: ErrorNode): void {
  //   if (this.result.errors === undefined) {
  //     this.result.errors = [];
  //   }
  //   this.result.errors.push(node.text);
  // }
}

export interface FileResult {
  name: string;
  loc: number;
  cc: number;
  functions: FunctionResult[];
  // errors?: string[];
}

export interface FunctionResult {
  name: string;
  loc: number;
  cc: number;
}
