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
    path: ".tmp/webpack",
    filename: "[name].js",
    target: "node",
    library: "app",
    libraryTarget: "commonjs2",
  },
  resolve: {
    /* modulesDirectories: [
      path.join(process.cwd(), "web_modules"),
      path.join(process.cwd(), "node_modules"),
    ], */
  },
  plugins: [],
})

module.exports = new Promise((resolve, reject) => {
  webpack(serverConfig)
    .run(function(error, stats) {
      if(error) {
        console.error(error)
        reject(error)
      } else {
        resolve(require(".tmp/webpack/bundle"))
      }
    })
})
