import { ParseTreeVisitor, ParseTree, RuleNode, TerminalNode } from 'antlr4ts/tree';
import { Parser } from 'antlr4ts';
import { Language } from './Language';

export class Visitor implements ParseTreeVisitor<void> {
  private language: Language;
  private ruleIndices: Map<string, number>;

  private functionStack: number[];

  private result: Result;

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

    this.result = { files: [{ ccn: 1 }], functions: [] };

    tree.accept(this);
  }

  visitChildren(node: RuleNode): void {
    const isFunctionDefinition =
      this.language.cachedSelectors &&
      this.language.cachedSelectors.functionDefinition.find(s => s.match(node)) !== undefined;

    if (isFunctionDefinition) {
      this.functionStack.push(this.result.functions.length);
      this.result.functions.push({
        name: '',
        ccn: 1,
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
        this.result.files[0].ccn++;
        this.functionStack.forEach(i => this.result.functions[i].ccn++);
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

export interface Result {
  files: UnitResult[];
  functions: UnitResult[];
  // errors?: string[];
}

export interface UnitResult {
  name?: string;
  ccn: number;
}
