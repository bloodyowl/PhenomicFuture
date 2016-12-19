const createWatcher = require("../watch")
const path = require("path")
const webpack = require("webpack")
const Match = require("react-router/Match").default
const React = require("react")
const ReactDOMServer = require("react-dom/server")

const processFile = require("../injection/processFile")

const nodeFetch = require("node-fetch")

const api = require("../api")
const prerender = require("../prerender")
const writeFile = require("../utils/writeFile")

const getDOMRoot = require("../utils/getDOMRoot")
const QueryString = require("../utils/QueryString")

const Document = require(path.join(process.cwd(), "examples", "container/Document.js"))
const buildURL = require("../utils/buildURL")
const createSitemap = require("../seo/sitemap")
const createRSS = require("../seo/feed")
const resolveURLsToPrerender = require("../prerender/resolve")
const db = require("../db")
const toQuery = require("../client/query")
const files = []

console.log("⚡️ Hey! Let's get on with it")
let lastStamp = Date.now()

require("rimraf").sync("dist")

async function getContent (db) {
  return new Promise((resolve, reject) => {
    const watcher = createWatcher({ path: path.join(process.cwd(), "./examples/content") })
    watcher.onChange(files => {
      watcher.close()
      Promise.all(files.map(file => processFile(db, file)))
        .then(resolve, reject)
    })
  })
}

function getRoutes(app) {
  return React.Children.toArray(app.props.children)
    .filter(child => child.props.forEach || child.props.pattern)
}

function createFetchFunction() {
  const toURL = buildURL("http://localhost:1414/api")
  return url => {
    return nodeFetch(toURL(url)).then(res => res.json())
  }
}

function wrapHTMLPage (rendered) {
  return (
    `<!DOCTYPE html>` +
    ReactDOMServer.renderToStaticMarkup(
      <Document
        body={getDOMRoot(rendered.value)}
        state={rendered.state}
      />
    )
  )
}

const toStaticURL = buildURL(path.join(process.cwd(), "dist/api"))

async function prerenderFileAndDependencies (app, fetch, url) {
  const rendered = await prerender(app, fetch, url)
  return Promise.all([
    writeFile(path.join(process.cwd(), "dist", rendered.url, "index.html"), wrapHTMLPage(rendered)),
    ...Object.keys(rendered.state).map(key => {
      return writeFile(toStaticURL(QueryString.decode(key)), JSON.stringify(rendered.state[key].node))
    })
  ])
}

async function renderSitemap (urls) {
  const xml = await createSitemap(urls)
  return writeFile(
    path.join(process.cwd(), "dist/sitemap.xml"),
    xml
  )
}

async function renderFeed (fetch) {
  const posts = await fetch(toQuery({ collection: "posts" }))
  const fullPosts = await posts.list.map(post => fetch(toQuery({ collection: "posts", id: post.url })))
  const xml = await createRSS(fullPosts)
  return writeFile(
    path.join(process.cwd(), "dist/feed.xml"),
    xml
  )
}

function buildWebpack() {
  return new Promise((resolve, reject) => {
    webpack(require(path.join(process.cwd(), "examples", "webpack.config.js")))
      .run(function(error, stats) {
        if(error) {
          reject(error)
        } else {
          resolve()
        }
      })
  })
}

async function build() {
  // Build webpack
  const app = await require("../client/app.server")
  console.log("📦 Webpack server side done "  + (Date.now() - lastStamp) + "ms")
  lastStamp = Date.now()
  // Retreive content
  await getContent(db)
  console.log("📝 Got your content " + (Date.now() - lastStamp) + "ms")
  lastStamp = Date.now()

  const fetch = createFetchFunction()
  const urls = await resolveURLsToPrerender(getRoutes(app), fetch)
  await Promise.all(urls.map(url => prerenderFileAndDependencies(app, fetch, url)))
  await renderSitemap(urls)
  await renderFeed(fetch)
  console.log("📃 Pre-rendering done " + (Date.now() - lastStamp) + "ms")
  lastStamp = Date.now()

  await buildWebpack()
  console.log("📦 Webpack built " + (Date.now() - lastStamp) + "ms")
  lastStamp = Date.now()
}

build()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log("🚀 Ready to ship!")
    process.exit(0)
  })

process.on("uncaughtException", function (err) {
  console.log(err)
})
