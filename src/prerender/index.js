const Provider = require("../client/Provider")

const buildURL = require("../utils/buildURL")
const createStore = require("../client/Store")

const React = require("react")
const ReactDOMServer = require("react-dom/server")
const ServerRouter = require("react-router/ServerRouter").default
const createServerRenderContext = require("react-router/createServerRenderContext").default

const isContainer = component => component.__isContainer === true
const nodeFetch = require("node-fetch")

const app = require("../../examples/App")

const prerender = url => {
  return new Promise((resolve, reject) => {
    const toURL = buildURL("http://localhost:1414/api/")
    const fetch = (a) => {
      const json = nodeFetch(toURL(a))
        .then(res => res.json())
      return json
    }

    const store = createStore()
    const context = createServerRenderContext()

    const render = () => {
      resolve({
        url,
        state: store.getState(),
        value: ReactDOMServer.renderToString(
          <Provider fetch={fetch} store={store}>
            <ServerRouter context={context} location={url}>
              {app}
            </ServerRouter>
          </Provider>
        ),
      })
    }

    ReactDOMServer.renderToString(
      <Provider fetch={fetch} store={store} onFetched={render} isPrerendering>
        <ServerRouter context={context} location={url}>
          {app}
        </ServerRouter>
      </Provider>
    )
  })
}

module.exports = prerender
