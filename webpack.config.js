const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const CopyPlugin = require('copy-webpack-plugin');

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
          },
          {
            test: /\.ejs$/i,
            use: 'raw-loader',
          },
        ]
      },
      output: {
        path : path.join(__dirname, "/public/dist"),
        filename: "bundle.js",
        publicPath: "/dist"
      },
      plugins: [
        new CopyPlugin({
          patterns: [
            {from: path.join(__dirname, '/src/view'), to: path.join(__dirname, '/public/views')},
            {from: path.join(__dirname, '/src/lib'), to: path.join(__dirname, '/public/lib/js')},

          ],
          options: {
            concurrency: 100,
          },
        }),
        new HtmlWebpackPlugin({
        filename: path.join(__dirname, '/public/views/index.ejs'),
        template: path.join(__dirname, '/src/view/index.ejs'),
        excludeChunks: [ 'server' ]

        }), new webpack.ProgressPlugin(),

      ]
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  );
};
