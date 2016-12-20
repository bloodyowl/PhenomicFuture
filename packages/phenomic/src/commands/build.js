const createWatcher = require("../watch")
const path = require("path")
const webpack = require("webpack")

const processFile = require("../injection/processFile")

require("isomorphic-fetch")

const createServer = require("../api")

const writeFile = require("../utils/writeFile")

const resolveURLsToPrerender = require("../prerender/resolve")
const db = require("../db")
const getPort = require("get-port")

console.log("⚡️ Hey! Let's get on with it")
let lastStamp = Date.now()

require("rimraf").sync("dist")

async function getContent (db, config) {
  return new Promise((resolve, reject) => {
    const watcher = createWatcher({
      path: path.join(config, "content"),
      plugins: config.plugins,
    })
    watcher.onChange(async function (files) {
      watcher.close()
      await db.destroy()
      try {
        await Promise.all(files.map(file => processFile(db, file, config.plugins)))
        resolve()
      } catch(error) {
        reject(error)
      }
    })
  })
}

function createFetchFunction(port) {
  const toURL = buildURL(`http://localhost:${ port }`)
  return url => {
    return fetch(toURL(url)).then(res => res.json())
  }
}

async function prerenderFileAndDependencies (config, app, fetch, url) {
  const files = await config.renderer.render(app, fetch, url)
  return Promise.all(files.map(file => writeFile(path.join(config.outdir, file.path), file.contents)))
}

async function build(config) {
  const phenomicServer = createServer(db, config.plugins)
  const port = await getPort()
  phenomicServer.listen(port)
  // Build webpack
  const app = await config.bundler.buildForPrerendering()
  console.log("📦 Webpack server side done "  + (Date.now() - lastStamp) + "ms")
  lastStamp = Date.now()
  // Retreive content
  await getContent(db, config)
  console.log("📝 Got your content " + (Date.now() - lastStamp) + "ms")
  lastStamp = Date.now()

  const fetch = createFetchFunction(port)
  const urls = await resolveURLsToPrerender(config.renderer.getRoutes(app), fetch)
  await Promise.all(urls.map(url => prerenderFileAndDependencies(config, app, fetch, url)))

  console.log("📃 Pre-rendering done " + (Date.now() - lastStamp) + "ms")
  lastStamp = Date.now()

  await config.bundler.build()
  console.log("📦 Webpack built " + (Date.now() - lastStamp) + "ms")
  lastStamp = Date.now()
}

/**
 *   build()
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
 */

module.exports = build
