const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const antlrCommand = 'npx antlr4ts';
const sourcePath = path.resolve(__dirname, 'res', 'grammars');
const destiinationPath = path.resolve(__dirname, 'src', 'grammars');
const grammarFileExtentionRegExp = /\.g4$/;
const typeScriptFileExtentionRegExp = /\.ts$/;

// run ANTLR4
const grammarFiles = fs
  .readdirSync(sourcePath, { withFileTypes: true })
  .filter(f => f.isFile() && grammarFileExtentionRegExp.test(f.name));

grammarFiles.forEach(file => {
  child_process.execSync(`${antlrCommand} -o ${destiinationPath} ${path.resolve(sourcePath, file.name)}`);
});

// create index.ts
const classNames = fs
  .readdirSync(destiinationPath, { withFileTypes: true })
  .filter(f => f.isFile() && f.name !== 'index.ts' && typeScriptFileExtentionRegExp.test(f.name))
  .map(f => f.name.replace(typeScriptFileExtentionRegExp, ''));

fs.writeFile(
  path.resolve(destiinationPath, 'index.ts'),
  classNames.map(c => `export { ${c} } from './${c}';\n`).join(''),
  error => {
    if (error) {
      console.error(error);
    }
  }
);
