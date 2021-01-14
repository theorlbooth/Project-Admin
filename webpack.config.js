const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DotEnv = require('dotenv-webpack')

module.exports = env => {
  return {
    entry: './frontend/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve('backend/dist'),
      publicPath: '/',
    },
    devtool: 'source-map',
    module: {
      rules: [
        { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.s(a|c)ss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
        { test: /\.(png|jpe?g|gif)$/i, use: 'file-loader' }
      ]
    },
    devServer: {
      contentBase: path.resolve('frontend'),
      hot: true,
      open: true,
      port: 8001,
      watchContentBase: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          secure: false
        }
      }
    },
    plugins: [
      new DotEnv(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: 'frontend/index.html',
        filename: 'index.html',
        inject: 'body'
      })
    ]
  }
}
