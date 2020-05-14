const routes = require('./webpack.routes');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ContentfulSettings = require('./src/config/contentful');
const VueLoader = require('vue-loader');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = !['production', 'devbuild'].includes(process.env.NODE_ENV);

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.js'
  },
  plugins: [
    new VueLoader.VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'assets/images/',
        }
      },
      {
        test: /\.ttf$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts/'
        }
      },
      {
        test: /\.(c)ss$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      ['~']: path.resolve(__dirname + '/src'),
      '@': path.resolve(__dirname + '/src/assets')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    overlay: true,
  },
  devtool: '#eval-source-map',
};

if (['production', 'devbuild'].includes(process.env.NODE_ENV)) {
  module.exports.devtool = '#source-map';
  module.exports.mode = 'production';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: process.env.NODE_ENV === 'production' ? '"production"' : '"devbuild"',
        BRAND_NAME: '"scala"',
        CONTENTFUL: JSON.stringify(ContentfulSettings),
        RECAPTCHA_SITEKEY: '"6Leu714UAAAAAGHkxLj0Ys1A6v9Oimj33FyLlwYw"'
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Scala',
      template: 'index.html',
      filename: path.resolve(__dirname, 'dist/index.html'),
      favicon: 'favicon.ico',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        removeComments: true,
        removeEmptyAttributes: true,
      }
    }),
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'dist'),
      // Optional - The location of index.html
      indexPath: path.join(__dirname, 'dist', 'index.html'),
      routes: routes,

      postProcess(renderedRoute) {
        let html = renderedRoute.html;
        if (html !== undefined || html !== null) {
          // Check for classes that have 'visible' and 'BUILD_IGNORE'
          // Remove 'visible' class to prevent visibility in rendered html file.
          if (html.indexOf('visible BUILD_IGNORE') !== -1) {
            html = html.replace('visible BUILD_IGNORE', '');
          }
          renderedRoute.html = html;
        }

        return renderedRoute;
      },

      renderer: new Renderer({
        headless: true,
        renderAfterDocumentEvent: 'render-event',
        maxConcurrentRoutes: 5,
        renderAfterTime: 1000,
        consoleHandler: async function (route, message) {
          if (message.type() === 'error') {
            if (message.text().includes('JSHandle@error')) {
              console.log("JS ERROR ON: ", route, message.text(), message.args());
            } else {
              console.log(route, message.text());
            }
          }
        },
      })
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false,
        },
      }
    }),
  ])
} else {
  module.exports.mode = 'development';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        BRAND_NAME: '"scala"',
        CONTENTFUL: JSON.stringify(ContentfulSettings),
        RECAPTCHA_SITEKEY: '"6Leu714UAAAAAGHkxLj0Ys1A6v9Oimj33FyLlwYw"'
      }
    }),
    new HtmlWebpackPlugin({
      title: 'DEVELOPMENT Scala',
      template: 'index.html',
      filename: 'index.html',
      favicon: 'favicon.ico',
      showErrors: true,
      // minify: {
      //   removeAttributeQuotes: true,
      //   collapseWhitespace: true,
      //   html5: true,
      //   minifyCSS: true,
      //   removeComments: true,
      //   removeEmptyAttributes: true,
      // },
    })
  ])
}
