const createWatcher = require("../watch")
const path = require("path")

const processFile = require("../injection/processFile")

const server = require("../api")
const webpack = require("webpack")
const webpackDevMiddleware = require("webpack-dev-middleware")

const React = require("react")
const ReactDOMServer = require("react-dom/server")

const getDOMRoot = require("../utils/getDOMRoot")
const db = require("../db")

console.log("🌍 Hey! Let's hack things a bit")
let lastStamp = Date.now()

const io = require("socket.io")(1415)

server.use(webpackDevMiddleware(
  webpack(require(path.join(process.cwd(), "examples", "webpack.config.js"))),
  { noInfo: true }
))

const Document = require(path.join(process.cwd(), "examples", "Document.js"))

server.get("*", (req, res) => {
  res.type('.html')
  const doc = ReactDOMServer.renderToStaticMarkup(
    <Document body={getDOMRoot()} />
  )
  res.end(`<!DOCTYPE html>${doc}`)
})

const watcher = createWatcher({ path: path.join(process.cwd(), "./examples/content") })

watcher.onChange(async function (files) {
  await db.destroy()
  await Promise.all(files.map(file => processFile(db, file)))
  io.emit("change")
})

console.log("✨ Open http://localhost:1414 " + (Date.now() - lastStamp) + "ms")
