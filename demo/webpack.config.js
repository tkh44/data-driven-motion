var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = env => {
  const PROD = env === 'production'

  var loaders = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    },
    {
      test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
      use: PROD ? 'file-loader' : 'url-loader'
    }
  ]

  return {
    devtool: PROD ? 'source-map' : 'eval',
    entry: path.resolve('src', 'index.js'),
    output: {
      path: path.resolve('build'),
      filename: 'main.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('src', 'index.tpl.html'),
        filename: 'index.html',
        inject: false
      })
    ].concat(new ExtractTextPlugin('styles.css')),
    module: {
      loaders: loaders
    }
  }
}
