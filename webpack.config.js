// @ts-check
const path = require('path');

/**
 * @type {import('webpack').Configuration}}
 */
const webpackConfigs = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'demo-page', 'index.js'),
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: 'babel-loader',
        exclude: /[\\\/](node_modules|lib)[\\\/]/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /[\\\/](node_modules|lib)[\\\/]/,
      },
    ],
  } /*,
     plugins: [
     new webpack.optimize.UglifyJsPlugin({
     compress: {
     warnings: false,
     screw_ie8: true
     },
     comments: false
     })
     ] */,
};

module.exports = webpackConfigs;
