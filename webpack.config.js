const path = require("path");
const entryPath = "src";
const entryFile = "index.js";


const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';


module.exports = {
  entry: ["whatwg-fetch", "regenerator-runtime/runtime.js", `./${entryPath}/js/${entryFile}`,
  ],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, `./assets/js`)
  },
  devtool: "source-map",
  watch: true,
  devServer: {
    contentBase: path.join(__dirname, `./`),
    publicPath: "/",
    compress: true,
    port: 3001,
    host: '0.0.0.0',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
    {
      test: /\.scss$/,
      use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
        'css-loader',
        'sass-loader',
      ]
    },
    {
      test: /\.(png|jpg|gif|webp|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: `[path][name].[ext]`,
            context: path.resolve(__dirname, "./src/img"),
            outputPath: isProduction ? '../img/' : './assets/img/',
            publicPath: isProduction ? '/assets/img' : './assets/img/',
          }
        }
      ]
    },

    ]
  },
  plugins: [
    new RemovePlugin({
      before: {
        include: ['./assets']
      },
    }),
    new MiniCssExtractPlugin({
      filename: '../css/style.css',
      filename: 'style.bundle.css'
    })
  ]
};