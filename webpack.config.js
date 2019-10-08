const path = require("path");
const Webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodemonPlugin = require('nodemon-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-bundle.js",
    publicPath: "/"
  },
  devServer: {
    contentBase: './dist',
    hot: true, 
    watchContentBase: true,
  },  
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), 
    new HtmlWebpackPlugin({
      template: "./src/app.html"
    }),
    new NodemonPlugin({
      script: './server/index.js', 
      watch: './server/index.js'
  })
  ]
};
