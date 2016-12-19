const Provider = require("../client/hoc/Provider")
const buildURL = require("../utils/buildURL")
const createStore = require("../client/store")

const React = require("react")
const ReactDOMServer = require("react-dom/server")
const ServerRouter = require("react-router/ServerRouter").default
const createServerRenderContext = require("react-router/createServerRenderContext").default

async function prerender (app, fetch, url) {
  return new Promise((resolve, reject) => {
    const store = createStore()
    const context = createServerRenderContext()

    function render() {
      try {
        resolve({
          url,
          state: store.getState(),
          value: ReactDOMServer.renderToString(
            <Provider
              fetch={fetch}
              store={store}
              onError={reject}
            >
              <ServerRouter
                context={context}
                location={`/${ url }`}
              >
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
      <Provider
        __prerendering
        fetch={fetch}
        store={store}
        onFetchComplete={render}
        onError={reject}
      >
        <ServerRouter
          context={context}
          location={`/${ url }`}
        >
          {app}
        </ServerRouter>
      </Provider>
    )
  })
}

module.exports = prerender
