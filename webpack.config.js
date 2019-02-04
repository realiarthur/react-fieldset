var path = require('path');

module.exports = {
  mode: 'production',
  entry: './react-fieldset',
  output: {
    filename: 'index.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
            presets: [ 
              "@babel/env",
              "@babel/react"
            ]
        }
      },
    ]
  }
};