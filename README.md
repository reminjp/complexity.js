# complexity.js

[![Latest NPM release][npm-badge]][npm-badge-url]
[![Install Size][npm-size-badge]][npm-size-badge-url]
[![License][license-badge]][license-badge-url]

A static code analyzer written in JavaScript.

## Usage

```bash
yarn add complexityjs
```

```js
import { analyze } from 'complexityjs';

analyze('test.cpp', 'int main() {}');
```

## Development

- Node.js
- Yarn
- Java Runtime Environment (for ANTLR4)

```bash
# install dependencies
$ yarn install

# test
$ yarn run test

# build for production
$ yarn run build
```

[npm-badge]: https://img.shields.io/npm/v/complexityjs.svg
[npm-badge-url]: https://www.npmjs.com/package/complexityjs
[npm-size-badge]: https://packagephobia.now.sh/badge?p=complexityjs
[npm-size-badge-url]: https://packagephobia.now.sh/result?p=complexityjs
[license-badge]: https://img.shields.io/npm/l/complexityjs.svg
[license-badge-url]: ./LICENSE
