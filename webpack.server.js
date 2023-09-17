const path = require("path");
const { merge } = require("webpack-merge");
const config = require("./webpack.config");
const nodeExternals = require("webpack-node-externals");

module.exports = merge(config, {
  target: "node",
  entry: "./src/server/index.js",
  externals: [nodeExternals()],
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
