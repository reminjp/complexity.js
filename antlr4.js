const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const antlrCommand = 'antlr';
const sourcePath = path.resolve(__dirname, 'res', 'grammars');
const destiinationPath = path.resolve(__dirname, 'src', 'grammars');
const grammarFileExtentionRegExp = /\.g4$/;
const javaScriptFileExtentionRegExp = /\.js$/;

// run ANTLR4
const grammarFiles = fs
  .readdirSync(sourcePath, { withFileTypes: true })
  .filter(f => f.isFile() && grammarFileExtentionRegExp.test(f.name));

grammarFiles.forEach(file => {
  child_process.execSync(
    `${antlrCommand} -o ${destiinationPath} -Dlanguage=JavaScript -no-listener ${path.resolve(sourcePath, file.name)}`
  );
});

const javaScriptFiles = fs
  .readdirSync(destiinationPath, { withFileTypes: true })
  .filter(f => f.isFile() && javaScriptFileExtentionRegExp.test(f.name));
const classNames = javaScriptFiles.map(f => f.name.replace(javaScriptFileExtentionRegExp, ''));

// create .ts files
classNames.forEach(className => {
  fs.writeFile(path.resolve(destiinationPath, `${className}.d.ts`), `export const ${className}: any;\n`, error => {
    if (error) {
      console.log(error);
    }
  });
});

fs.writeFile(
  path.resolve(destiinationPath, 'index.ts'),
  classNames.map(c => `export * from './${c}';\n`).join(''),
  error => {
    if (error) {
      console.log(error);
    }
  }
);
