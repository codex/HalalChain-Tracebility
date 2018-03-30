const path = require('path');
const config = require('./config');
const webpack = require('webpack');
const express = require('express');
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const webpackDevServer = require('webpack-dev-server');
const port = 4001;
const hot_server_host = 'localhost';

const loaders = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      "presets": ["react", "es2015", "stage-0", "react-hmre"],
      "plugins": [["import", {"style": "true", "libraryName": "antd"}]],
    }
  }, {
    test: /\.json$/,
    exclude: /node_modules/,
    loader: 'json'
  },
  {
      test: /\.(png|jpg|jpeg|gif)$/,
      loader: "url?name=[path][name].[ext]&limit=2048"
  }, 
  {
    test: /\.css$/,
    loader: 'style!css!postcss'
  },
  {
    test: /\.less$/,
    loader: 'style!css!postcss!less'
  }
];


const webpackConfig = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  entry: [
      'webpack-dev-server/client?http://' + hot_server_host + ':' + port,
      'webpack/hot/dev-server',
      './src/client.js'
    ],

  output: {
    path: '/public/',
    filename: '[name].js',
    publicPath: 'http://' + hot_server_host + ':' + port + '/'
  },
  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    "./src/client.js"

  ],

  output: {
    path: '/public/',
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },

  // devtool: 'eval',
  devtool: 'cheap-module-source-map',

  // What information should be printed to the console
  stats: {
    colors: true
  },

  // Options affecting the normal modules
  module: {
    loaders
  },

  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  postcss: [
    // pxtorem({
    //   rootValue: 100,
    //   propWhiteList: [],
    //   selectorBlackList:["geetest",".envelope","letter"]
    // }),
    autoprefixer()
  ],
  // The list of plugins for Webpack compiler
  plugins: [
    new HtmlWebpackPlugin({
      title: config.dev.pageTitle,
      template: './webpack/template.html',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.join(__dirname, '../public/')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')        
      },
      'FFAN_CONFIG':JSON.stringify(config.dev.FFAN_CONFIG)
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

// const compiler = webpack(webpackConfig);
// const server = new webpackDevServer(compiler, {
//   hot: true,
//   contentBase: path.join(__dirname, '../public/'),
//   historyApiFallback: true
// });
// server.listen(env.hot_server_port);


var app = express();
var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler);
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
});

app.use(devMiddleware);

app.use(hotMiddleware);

app.use(express.static('./public'));
app.use(function response(req, res) {
  res.sendFile(path.resolve('./public/index.html'));
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')
})