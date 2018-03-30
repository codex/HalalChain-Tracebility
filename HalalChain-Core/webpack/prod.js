const config = require('./config');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const WebpackShellPlugin = require('./shell');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let _config = config.prod;
const argv = process.argv.slice(2).length > 0 ? process.argv.slice(2)[0] : '';
if (argv && argv.toLocaleLowerCase().indexOf('test') > -1) {
  _config = config.test;
}
if (argv && argv.toLocaleLowerCase().indexOf('gray') > -1) {
  _config = config.gray;
}
if (argv && argv.toLocaleLowerCase().indexOf('develop') > -1) {
  _config = config.dev;
}

const loaders = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      presets: ['react', 'es2015', 'stage-0'],
      plugins: [['import', { style: 'true', libraryName: 'antd' }]]
    }
  },
  {
    test: /\.json$/,
    exclude: /node_modules/,
    loaders: ['json-loader']
  },
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    loader: 'url?name=[path][name].[ext]&limit=2048'
  },
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style', 'css!postcss')
  },
  {
    test: /\.less/,
    loader: ExtractTextPlugin.extract('style', 'css!postcss!less')
  }
];

const webpackConfig = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  entry: {
    index: './src/client.js'
  },

  output: {
    path: './public/',
    publicPath: '',
    filename: '/js/[name]-[hash].js',
    chunkFilename: '/js/[name]-[hash].js'
  },

  module: {
    loaders
  },
  postcss: [
    // pxtorem({
    //   rootValue: 100,
    //   propWhiteList: [],
    //   selectorBlackList:["geetest",".envelope","letter"]
    // }),
    autoprefixer()
  ],
  // postcss: [autoprefixer()],
  plugins: [
    new CleanWebpackPlugin(['css', 'js'], {
      root: path.join(__dirname, '../public/'),
      verbose: true,
      dry: false
    }),
    new HtmlWebpackPlugin({
      title: 'HLC-Demo',
      template: './webpack/template.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      FFAN_CONFIG: JSON.stringify(_config.FFAN_CONFIG)
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('/css/[name].[hash].css'),
    new CSSSplitWebpackPlugin({
      size: 2500,
      filename: '/css/[name]-[part].css'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    })
    // new WebpackShellPlugin({
    //   onBuildEnd: [
    //     'rsync -avrz public root@10.213.58.206:/opt/www/'
    //   ]
    // })
  ]
};
webpack(webpackConfig, (err, stats) => {
  console.log('打包完成！');
});
