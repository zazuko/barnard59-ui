const { resolve } = require('path')
const IS_DEV_SERVER = process.argv.find(arg => arg.includes('webpack-dev-server'))
const ENV = process.argv.find(arg => arg.includes('NODE_ENV=production')) ? 'production' : 'development'
const OUTPUT_PATH = IS_DEV_SERVER ? resolve('.') : resolve('.build')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: ENV,
  entry: './src/Barnard59App.js',
  output: {
    path: OUTPUT_PATH,
    filename: 'barnard59-app.js'
  },
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  devServer: {
    contentBase: OUTPUT_PATH,
    compress: true,
    overlay: {
      errors: true
    },
    host: '0.0.0.0',
    port: '8008',
    disableHostCheck: true,
    historyApiFallback: {
      index: 'public/index.html'
    }
  }
}
