const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const antlrCommand = 'antlr';
const grammarPath = path.resolve(__dirname, 'src', 'grammars');
const grammarFileExtentionRegExp = /\.g4$/;
const javaScriptFileExtentionRegExp = /\.js$/;

const grammarFiles = fs
  .readdirSync(grammarPath, { withFileTypes: true })
  .filter(f => f.isFile() && grammarFileExtentionRegExp.test(f.name));

grammarFiles.forEach(file => {
  child_process.execSync(`${antlrCommand} -Dlanguage=JavaScript -no-listener ${path.resolve(grammarPath, file.name)}`);
});

const javaScriptFiles = fs
  .readdirSync(grammarPath, { withFileTypes: true })
  .filter(f => f.isFile() && javaScriptFileExtentionRegExp.test(f.name));
const classNames = javaScriptFiles.map(f => f.name.replace(javaScriptFileExtentionRegExp, ''));

classNames.forEach(className => {
  fs.writeFile(path.resolve(grammarPath, `${className}.d.ts`), `export const ${className}: any;\n`, error => {
    if (error) {
      console.log(error);
    }
  });
});

fs.writeFile(
  path.resolve(grammarPath, 'index.ts'),
  classNames.map(c => `export * from './${c}';\n`).join(''),
  error => {
    if (error) {
      console.log(error);
    }
  }
);
