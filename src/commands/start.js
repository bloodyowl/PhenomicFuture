const watch = require("../watch")
const path = require("path")

const processFile = require("../injection/processFile")

const server = require("../api")
const webpack = require("webpack")
const webpackDevMiddleware = require("webpack-dev-middleware")

const React = require("react")
const ReactDOMServer = require("react-dom/server")

const getDOMRoot = require("../dom/getDOMRoot")

server.use(webpackDevMiddleware(
  webpack(require(path.join(process.cwd(), "examples", "webpack.config.js")))
))

const Document = require(path.join(process.cwd(), "examples", "container/Document.js"))

server.get("*", (req, res) => {
  res.type('.html')
  const doc = ReactDOMServer.renderToStaticMarkup(
    <Document body={getDOMRoot()} />
  )
  res.end(`<!DOCTYPE html>${doc}`)
})

watch({
  path: path.join(process.cwd(), "./examples/content"),
  onFile: processFile,
})
