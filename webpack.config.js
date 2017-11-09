const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/public/js/main.js'],
  output: {
    path: path.join(__dirname, './src/public/js/'),
    filename: 'bundle.js',
    publicPath: '/js/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
}
