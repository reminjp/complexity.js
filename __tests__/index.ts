import * as fs from 'fs';
import * as path from 'path';
import { analyze } from '../src';

const testCasePath = path.resolve(__dirname, 'cases');
const inputFileNameRegExp = /^input\.[^.]+$/;
const outputFileNameRegExp = /^output.json$/;

describe('analyze', () => {
  const dirs = fs.readdirSync(testCasePath, { withFileTypes: true });

  dirs.forEach(dir => {
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

    test(`${dir.name}/${inputFile.name}`, async done => {
      expect(await analyze(inputFile.name, input)).toEqual(outputObject);
      done();
    });
  });
});
