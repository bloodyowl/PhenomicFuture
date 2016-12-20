const createWatcher = require("../watch")
const path = require("path")
const processFile = require("../injection/processFile")

const webpack = require("webpack")
const webpackDevMiddleware = require("webpack-dev-middleware")

const React = require("react")
const ReactDOMServer = require("react-dom/server")

const db = require("../db")
const createServer = require("../api")

const express = require("express")

function createWebpackServer(config) {
  const server = express()
  server.use(config.bundler.getMiddleware(config))
  // move to plugin
  server.use("/assets", express.static(path.join(process.cwd(), "examples/content")))
  server.get("*", function (req, res) {
    res.type(".html")
    res.end(config.renderer.renderHTML())
  })
  return server
}


function start (config) {
  const phenomicServer = createServer(db, config.plugins)
  const webpackServer = createWebpackServer(config)
  const io = require("socket.io")(1415)
  const watcher = createWatcher({
    path: path.join(config.path, "content"),
    plugins: config.plugins,
  })
  watcher.onChange(async function (files) {
    await db.destroy()
    await Promise.all(files.map(file => processFile(db, file, config.plugins)))
    io.emit("change")
  })
  webpackServer.use("/phenomic", phenomicServer)
  webpackServer.listen(config.port)
  console.log(`✨ Open http://localhost:${ config.port }`)
}

module.exports = start
