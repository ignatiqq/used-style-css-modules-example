const path = require("path");
const { merge } = require("webpack-merge");
const config = require("./webpack.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {ImportedPlugin} = require('webpack-imported');

module.exports = merge(config, {
  target: "web",
  entry: "./src/client/index.js",
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      fs: false
    }
  },
  output: {
    path: path.resolve(__dirname, "build", "client"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }
        }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css"
    }),
    new ImportedPlugin('imported.json', {
      saveToFile: path.join(__dirname, 'imported.json'),
  }),
  ],
});
