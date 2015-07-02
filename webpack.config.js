var webpack = require('webpack');
var path = require('path');

module.exports = {
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
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass'
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
    }]
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
    })
  ]
}
