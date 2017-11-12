const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './public/javascripts/dronedrops-app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './public/index.html', to: "index.html" }
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.scss$/,
        // resolve-url allow to resolve url() please keep it mind to set the output.publicPath
        //   to use absolute path. This is usefull is you have fonts and css folders on
        //   different folders
        loader: process.env.NODE_ENV == 'production' ?
            // the plugin is used to store css content to an external file
            // without this plugin css will be store as a variable inside the final
            // bundle file
            ExtractTextPlugin.extract('css!resolve-url!sass') :

            // the style loader is usefull to load the style inline with WebpackDevServer
            'style!css!resolve-url!sass'
    }
    ]
  }
}
