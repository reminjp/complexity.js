import * as fs from 'fs';
import * as path from 'path';
import { analyze } from '../src';

const testCasePath = path.resolve(__dirname, 'cases');
const inputFileNameRegExp = /^input\.[^.]+$/;
const outputFileNameRegExp = /^output.json$/;

interface TestCase {
  name: string;
  input: {
    filename: string;
    code: string;
  };
  output: any;
}

const testCases: TestCase[] = [];

fs.readdirSync(testCasePath, { withFileTypes: true }).forEach(dir => {
  if (!dir.isDirectory()) {
    return;
  }

  const files = fs.readdirSync(path.resolve(testCasePath, dir.name), { withFileTypes: true });

  const inputFile = files.find(f => f.isFile() && inputFileNameRegExp.test(f.name));
  const outputFile = files.find(f => f.isFile() && outputFileNameRegExp.test(f.name));

  if (inputFile === undefined || outputFile === undefined) {
    return;
  }

  const input = fs.readFileSync(path.resolve(testCasePath, dir.name, inputFile.name), { encoding: 'utf-8' });
  const output = fs.readFileSync(path.resolve(testCasePath, dir.name, outputFile.name), { encoding: 'utf-8' });
  const outputObject = JSON.parse(output);

  testCases.push({
    name: `${dir.name}/${inputFile.name}`,
    input: { filename: inputFile.name, code: input },
    output: outputObject,
  });
});

describe('analyze', () => {
  testCases.forEach(testCase => {
    test(testCase.name, async done => {
      expect(await analyze(testCase.input.filename, testCase.input.code)).toEqual(testCase.output);
      done();
    });
  });
});
