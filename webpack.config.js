const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'complexityjs',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        use: 'eslint-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules'],
  },
  // for ANTLR4
  node: {
    module: 'empty',
    fs: 'empty',
  },
};
