var webpack = require('webpack');
var path = require('path');

var config = {
  entry: {
    main: './src/client.js'
  },
  target: 'web',
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      jquery: 'jquery/src/jquery'
    }
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel'
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    }, {
      test: /\.gif$/,
      loader: 'url?limit=10000&mimetype=image/gif'
    }, {
      test: /\.jpg$/,
      loader: 'url?limit=10000&mimetype=image/jpg'
    }, {
      test: /\.png$/,
      loader: 'url?limit=10000&mimetype=image/png'
    }, {
      test: /\.woff$/,
      loader: 'url?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.woff2$/,
      loader: 'url?limit=10000&mimetype=application/font-woff2'
    }, {
      test: /\.ttf$/,
      loader: 'file?mimetype=application/vnd.ms-fontobject'
    }, {
      test: /\.eot$/,
      loader: 'file?mimetype=application/x-font-ttf'
    }, {
      test: /\.svg$/,
      loader: 'file?mimetype=image/svg+xml'
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },
  externals: {
    'react': 'React',
    'jquery': 'jQuery',
    'leaflet': 'L'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'root.jQuery': 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}

module.exports = config;
