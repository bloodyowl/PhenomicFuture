const webpack = require("webpack")
const path = require("path")
const config = require(path.join(process.cwd(), "examples", "webpack.config.js"))

const serverConfig = Object.assign({}, config, {
  entry: {
    bundle: path.join(process.cwd(), "examples", "App.js"),
  },
  externals: [
    function(context, request, callback) {
      if(/^[a-z\-0-9]+$/.test(request)) {
        return callback(null, "commonjs " + path.join(process.cwd(), "node_modules", request))
      }
      callback()
    }
  ],
  output: {
    publicPath: "/",
    path: path.join(process.cwd(), ".tmp/webpack"),
    filename: "[name].js",
    target: "node",
    library: "app",
    libraryTarget: "commonjs2",
  },
  resolve: {
    root: [
      path.join(process.cwd(), "examples"),
    ],
  },
})

module.exports = new Promise((resolve, reject) => {
  webpack(serverConfig)
    .run(function(error, stats) {
      if(error) {
        console.error(error)
        reject(error)
      } else {
        resolve(require(path.join(process.cwd(), ".tmp/webpack/bundle")))
      }
    })
})
