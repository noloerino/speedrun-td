require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    client: ['./src/client.js'],
  },
  output: {
    path: path.join(__dirname, 'bin'),
    filename: '[name].js'
  }
}
