const Provider = require("../client/Provider")

const buildURL = require("../utils/buildURL")
const createStore = require("../client/Store")

const React = require("react")
const ReactDOMServer = require("react-dom/server")
const ServerRouter = require("react-router/ServerRouter").default
const createServerRenderContext = require("react-router/createServerRenderContext").default

const isContainer = component => component.__isContainer === true
const nodeFetch = require("node-fetch")

async function prerender (app, fetch, url) {
  return new Promise((resolve, reject) => {
    const store = createStore()
    const context = createServerRenderContext()

    const render = () => {
      try {
        resolve({
          url,
          state: store.getState(),
          value: ReactDOMServer.renderToString(
            <Provider fetch={fetch} store={store}>
              <ServerRouter context={context} location={`/${ url }`}>
                {app}
              </ServerRouter>
            </Provider>
          ),
        })
      } catch(error) {
        reject(error)
      }
    }

    ReactDOMServer.renderToString(
      <Provider fetch={fetch} store={store} onFetched={render} isPrerendering>
        <ServerRouter context={context} location={`/${ url }`}>
          {app}
        </ServerRouter>
      </Provider>
    )
  })
}

module.exports = prerender
