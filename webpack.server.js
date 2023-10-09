const path = require("path");
const { merge } = require("webpack-merge");
const config = require("./webpack.config");

module.exports = merge(config, {
  target: "node",
  entry: "./src/server/index.js",
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      fs: require.resolve('fs'),
    }
  },
  output: {
    path: path.resolve(__dirname, "build", "server"),
    filename: "index.js",
  },
  module: {
		rules: [
			{
        test: /\.css$/,
				use: [
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                exportOnlyLocals: true,
              },
            }
          },
				],
			},
		],
	},
});
