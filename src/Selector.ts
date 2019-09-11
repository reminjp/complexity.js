import { RuleNode, TerminalNode } from 'antlr4ts/tree';

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
        if (token === '*' || token === '>') {
          return token;
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
        this.elements[0] === '*' ||
        ((node as any).ruleContext && (node as any).ruleContext.ruleIndex === this.elements[0]) ||
        node.text === this.elements[0]
      )
    ) {
      return false;
    }

    let elementIndex = 1;
    for (let n = node.parent; n !== undefined && elementIndex < this.elements.length; n = n.parent) {
      const shouldDirectChild = this.elements[elementIndex] === '>';
      if (shouldDirectChild) {
        elementIndex++;
        if (elementIndex >= this.elements.length) {
          break;
        }
      }

      if (
        this.elements[elementIndex] === '*' ||
        n.ruleContext.ruleIndex === this.elements[elementIndex] ||
        n.text === this.elements[elementIndex]
      ) {
        elementIndex++;
      } else if (shouldDirectChild) {
        break;
      }
    }
    return elementIndex >= this.elements.length;
  }
}
