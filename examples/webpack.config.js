const path = require('path');

module.exports = {
  mode: 'development',
  entry: './examples/index.js',
  output: {
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, '/'),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/env', '@babel/react'],
        },
      },
    ],
  },
}
