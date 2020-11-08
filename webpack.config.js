require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const config = require('./build/config')

module.exports = (env, argv) => {
  let isProduction = argv.mode === 'production'
  let baseUrl = isProduction ? config.prod.assetsPublicPath : config.dev.assetsPublicPath
  // console.log(env, argv)
  return {
    mode: argv.mode,
    entry: {
      app: path.resolve(__dirname, './src/index.js')
    },
    output: {
      path: config.prod.assetsRoot,
      filename: `js/[name].[contenthash].js`,
      publicPath: baseUrl,
      assetModuleFilename: `assets/[hash][ext][query]`
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.scss', '.css'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        // 'react-dom': isProduction ? 'react-dom' : '@hot-loader/react-dom'
      }
    },
    devtool: !isProduction
      ? config.dev.devtool
      : config.prod.productionSourceMap
        ? config.prod.devtool
        : false,
    devServer: {
      contentBase: path.join(__dirname, 'src'),
      // By default files from `contentBase` will not trigger a page reload.
      watchContentBase: true,
      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/,
        poll: config.dev.poll,
      },
      host: config.dev.host,
      port: config.dev.port,
      proxy: config.dev.proxyTable,
      inline: true,
      hot: true,
      compress: true,
      open: false,
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
      // Silence WebpackDevServer's own logs since they're generally not useful.
      // It will still show compile warnings and errors with this setting.
      clientLogLevel: 'silent',
      // Show less info in the terminal (errors only)
      stats: 'minimal',
      // Since development mode thinks of Webpack DevServer as the place to get index.html
      // instead of a file system or a Node backend, we need to tell DevServer to always
      // serve index.html for refreshes since we have an SPA
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.m?jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  !isProduction && 'react-refresh/babel',
                ].filter(Boolean),
              },
            }
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // // Creates `style` nodes from JS strings
            argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }
          ],
        },
        {
          // images / icons
          test: /\.(png|svg|jpe?g|gif)$/,
          type: 'asset/resource'
        },
        {
          // Fonts
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource'
        },
        {
          // Media
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset/resource'
        },
      ],
    },
    optimization: {
      // minimize: isProduction,
      // minimizer: [
      //   new TerserPlugin({
      //     cache: true,
      //     parallel: true,
      //     sourceMap: true, // Must be set to true if using source-maps in production
      //     terserOptions: {
      //       // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
      //     }
      //   }),
      // ],
      moduleIds: isProduction ? 'deterministic' : 'named',
      runtimeChunk: 'single',
      emitOnErrors: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        BASE_URL: JSON.stringify(baseUrl),
        WS_URL: JSON.stringify(process.env.WS_URL)
      }),
      // new webpack.SourceMapDevToolPlugin({
      //   filename: '[file].map'
      // }),
  
      // Copies files from target to destination folder
      // new CopyWebpackPlugin({
      //   patterns: [
      //     {
      //       from: path.resolve(__dirname, './static'),
      //       globOptions: {
      //         ignore: ['*.DS_Store'],
      //       },
      //     },
      //   ],
      // }),
      new CleanWebpackPlugin(),
  
      ...(isProduction
        ? [
          new MiniCssExtractPlugin({
            filename: `css/[name].[contenthash].css`,
            chunkFilename: '[id].css',
          }),
        ]
        : [
          new webpack.HotModuleReplacementPlugin(),
          new ReactRefreshWebpackPlugin(),
          // new webpack.NoEmitOnErrorsPlugin(),
        ]
      ),
  
      new HtmlWebpackPlugin({
        title: 'Dice poker',
        filename: 'index.html',
        template: path.resolve(__dirname, './src/template/index.html'),
      }),
    ]
  }
}