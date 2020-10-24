const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require("./build-utils/loadPresets");
const path = require("path");

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
  return webpackMerge(
    {
      mode,
      module: {
        rules: [
          {
            test: /\.jpe?g$/,
            use: [
              {
                loader: "url-loader",
                options: {
                  limit: 5000
                }
              }
            ]
          }
        ]
      },
      output: {
        path : path.join(__dirname, "/public/dist"),
        filename: "bundle.js",
        publicPath: "/dist"
      },
      plugins: [new HtmlWebpackPlugin({
        filename: path.join(__dirname, '/public/views/index.ejs'),
        template: path.join(__dirname, '/src/view/index.ejs'),
        excludeChunks: [ 'server' ]

        }), new webpack.ProgressPlugin()]
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  );
};
