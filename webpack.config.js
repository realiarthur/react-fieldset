var path = require('path');
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: 'production',
  entry: './react-fieldset',
  externals: [nodeExternals()],

  output: {
    filename: 'index.js',
    path: __dirname,
    libraryTarget: 'umd'
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