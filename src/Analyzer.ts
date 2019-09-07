import { LanguageConfig, Selector } from './languages';
import { ParseTree } from './Parser';

export class Analyzer {
  private language: LanguageConfig;

  constructor(language: LanguageConfig) {
    this.language = language;
  }

  public analyze(tree: ParseTree): Result {
    const result: Result = {
      files: [
        {
          name: '',
          ccn: 1,
        },
      ],
      functions: [],
    };
    const fileStack: number[] = [0];
    const functionStack: number[] = [];

    const dfs = (node: ParseTree) => {
      const isFunctionDefinition = this.matchOneofSelectors(node, this.language.selectors.functionDefinition);
      const isFunctionName = this.matchOneofSelectors(node, this.language.selectors.functionName);
      const isCcnIncrement = this.matchOneofSelectors(node, this.language.selectors.ccnIncrement);

      if (isFunctionDefinition) {
        functionStack.push(result.functions.length);
        result.functions.push({
          name: '',
          ccn: 1,
        });
      }
      if (isFunctionName && functionStack.length > 0) {
        result.functions[functionStack[functionStack.length - 1]].name = node.text;
      }
      if (isCcnIncrement) {
        fileStack.forEach(i => result.files[i].ccn++);
        functionStack.forEach(i => result.functions[i].ccn++);
      }

      node.children.forEach(child => dfs(child));

      if (isFunctionDefinition) {
        functionStack.pop();
      }
    };
    dfs(tree);

    return result;
  }

  private matchSelector(node: ParseTree, selector: Selector) {
    let r = true;
    for (let i = 0, t = node; i < selector.length; i++, t = t.parent) {
      if (
        t === undefined ||
        (selector[selector.length - 1 - i] !== undefined && t.symbol !== selector[selector.length - 1 - i])
      ) {
        r = false;
        break;
      }
    }
    return r;
  }

  private matchOneofSelectors(node: ParseTree, selectors: Selector[]) {
    return selectors.find(s => this.matchSelector(node, s)) !== undefined;
  }
}

export interface Result {
  files: [ResultUnit];
  functions: ResultUnit[];
}

export interface ResultUnit {
  name: string;
  ccn: number;
}
