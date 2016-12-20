const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    bundle: "./App.js",
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
        loaders: [
          process.env.NODE_ENV !== "production" && "style",
          "css"
        ]
          .filter(_ => _),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
    process.env.NODE_ENV === "production" && new webpack.optimize.OccurrenceOrderPlugin(),
    process.env.NODE_ENV === "production" && new webpack.optimize.UglifyJsPlugin(),
  ].filter(item => item),
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
  },
}
