const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    bundle: path.join(process.cwd(), "src/client/index.js"),
  },
  output: {
    publicPath: "/",
    path: path.join(process.cwd(), "dist"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
      },
      {
        test: /\.css$/,
        loader: "style!css",
      }
    ],
  },
  plugins: [
    process.env.NODE_ENV === "production" && new webpack.optimize.OccurrenceOrderPlugin(),
    process.env.NODE_ENV === "production" && new webpack.optimize.UglifyJsPlugin(),
  ].filter(item => item),
}
