var path = require('path')
var webpack = require('webpack')
var fileSystem = require("fs-extra")
var HtmlWebpackPlugin = require("html-webpack-plugin")

// load the secrets
var alias = {}

var secretsPath = path.join(__dirname, ("secrets." + process.env.NODE_ENV + ".js"));

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}


module.exports = {
  entry: './src/js/app/app.js',
  output: {
    path: path.resolve(__dirname, './dist/js/app/'),
    publicPath: '/dist/',
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  // clean de dist folder
  fileSystem.emptyDirSync(path.resolve(__dirname, "dist"));
  console.log("dist folder cleared");

  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
  var manifest = require(path.resolve(__dirname, "src/manifest.json"));
  // generates the manifest file using the package.json informations
  manifest.description = process.env.npm_package_description;
  manifest.version = process.env.npm_package_version;

  fileSystem.writeFileSync(
    path.resolve(__dirname, "dist/manifest.json"),
    JSON.stringify(manifest)
  );

  console.log("manifest file copied");

  fileSystem.copy(path.resolve(__dirname, './src/assets'), path.resolve(__dirname, './dist/assets') , function (err) {
    if (err) return console.error(err)
      console.log("Assets Copied")
  })

  fileSystem.copy(path.resolve(__dirname, './src/css'), path.resolve(__dirname, './dist/css') , function (err) {
    if (err) return console.error(err)
      console.log("CSS Copied")
  })

  fileSystem.copy(path.resolve(__dirname, './src/fonts'), path.resolve(__dirname, './dist/fonts') , function (err) {
    if (err) return console.error(err)
      console.log("Fonts Copied")
  })

  fileSystem.copy(path.resolve(__dirname, './src/js/ext'), path.resolve(__dirname, './dist/js/ext') , function (err) {
    if (err) return console.error(err)
      console.log("Ext files Copied")
  })

  fileSystem.copy(path.resolve(__dirname, './src/ext.html'), path.resolve(__dirname, './dist/ext.html') , function (err) {
    if (err) return console.error(err)
      console.log("Ext html file Copied")
  })


}
