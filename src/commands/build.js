const watch = require("../watch")
const path = require("path")
const webpack = require("webpack")
const Match = require("react-router/Match").default
const React = require("react")
const ReactDOMServer = require("react-dom/server")

const processFile = require("../injection/processFile")

const app = require("../../examples/App")

const matches = app.props.children.filter(child => child.type === Match)
const nodeFetch = require("node-fetch")

const api = require("../api")
const prerender = require("../prerender")
const writeFile = require("../utils/writeFile")

const getDOMRoot = require("../dom/getDOMRoot")
const QueryString = require("../utils/QueryString")

const Document = require(path.join(process.cwd(), "examples", "container/Document.js"))

const files = []

console.log("⚡️ Hey! Let's get on with it")

watch({
  path: path.join(process.cwd(), "./examples/content"),
  onFile: file => files.push(processFile(file)),
  onFirstBatch: client => {
    Promise.all(files).then(render)
    console.log("📝 Got your content")
    client.end()
  },
})

const buildURL = require("../utils/buildURL")

const toURL = buildURL("http://localhost:1414/api/")
const fetch = (a) => {
  const json = nodeFetch(toURL(a))
    .then(res => res.json())
  return json
}

const toStaticURL = buildURL(path.join(process.cwd(), "dist/api/"))

const getPages = () => {
  const paginated = matches.filter(match => match.props.paginated)
  const queries = paginated
    .map(match => match.props.component.getQueries({ params: {} }))
    .map(spec => spec[Object.keys(spec).find(key => spec[key].hasOwnProperty("after"))])
  const urls = matches.filter(match => !match.props.paginated).map(match => match.props.pattern)
  const fetchNextURL = (pattern, query) => {
    urls.push(pattern.replace("/:after?", query.after ? "/" + query.after : ""))
    return fetch(query)
      .then(res => res.hasNextPage ? fetchNextURL(pattern, Object.assign({}, query, { after: res.next })) : null)
  }
  return Promise.all(paginated.map((match, index) => fetchNextURL(match.props.pattern, queries[index])))
    .then(() => urls)
}

const render = () =>
  nodeFetch("http://localhost:1414/api/posts.json")
    .then(res => res.json())
    .then(json => getPages()
      .then(urls => [
        ...json.list.map(item => item.url),
        ...urls,
      ])
    )
    .then(json =>
      Promise.all(json.map(url => {
        return prerender(url)
          .then(rendered => {
            return Promise.all([
              writeFile(
                path.join(process.cwd(), "dist", "." + rendered.url, "index.html"),
                `<!DOCTYPE html>${
                    ReactDOMServer.renderToStaticMarkup(
                      <Document body={getDOMRoot(rendered.value)} state={rendered.state} />
                    )
                  }`
              ),
              ...Object.keys(rendered.state)
                .map(key => {
                  const config = QueryString.decode(key)
                  return writeFile(
                    toStaticURL(config),
                    JSON.stringify(rendered.state[key].value)
                  )
                })
            ])
          })
          .catch((err) => {
            console.error(`Error rendering ${ url }`)
            console.error(err)
          })
      }))
    )
    .then(() => {
      console.log("📃 Pre-rendering done")
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        webpack(require(path.join(process.cwd(), "examples", "webpack.config.js")))
          .run(function(error, stats) {
            if(error) {
              reject(error)
            } else {
              console.log("📦 Webpack built")
              resolve()
            }
          })
      })
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
    .then(() => {
      console.log("🚀 Ready to ship!")
      process.exit(0)
    })
