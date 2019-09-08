import { ParseTreeVisitor, ParseTree, RuleNode, TerminalNode } from 'antlr4ts/tree';
import { Parser } from 'antlr4ts';

export class DebugVisitor implements ParseTreeVisitor<void> {
  private parser: Parser;
  private depth: number;
  private result: string;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  getResult() {
    return this.result;
  }

  visit(tree: ParseTree): void {
    this.depth = 0;
    this.result = '';
    tree.accept(this);
  }

  visitChildren(node: RuleNode): void {
    this.result += `${'  '.repeat(this.depth)}${this.parser.ruleNames[node.ruleContext.ruleIndex]}\n`;
    this.depth++;
    for (let i = 0; i < node.childCount; i++) {
      node.getChild(i).accept(this);
    }
    this.depth--;
  }

  visitTerminal(node: TerminalNode): void {
    this.result += `${'  '.repeat(this.depth)}'${node.text}'\n`;
  }

  visitErrorNode(): void {}
  // visitErrorNode(node: ErrorNode): void {
  //   if (this.result.errors === undefined) {
  //     this.result.errors = [];
  //   }
  //   this.result.errors.push(node.text);
  // }
}
