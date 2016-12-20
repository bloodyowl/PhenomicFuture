const React = require("react")
const ReactDOMServer = require("react-dom/server")

const Provider = require("../components/Provider")
const HTML = require("../components/HTML")

const createStore = require("../shared/store")

const ServerRouter = require("react-router/ServerRouter").default
const createServerRenderContext = require("react-router/createServerRenderContext").default
const renderHTML = require("./renderHTML")
const createURL = require("phenomic-api-client/lib/url")
const QueryString = require("../shared/QueryString")

function render (app, fetch, url) {
  return new Promise((resolve, reject) => {
    const store = createStore()
    const context = createServerRenderContext()

    function render() {
      try {
        const contents = ReactDOMServer.renderToString(
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
        )

        resolve([
          { path: path.join(rendered.url, "index.html"), contents: renderHTML({ body: contents, state: store.getState() }) },
          ...Object.keys(rendered.state)
            .map(key => ({ path: createURL({ root: "phenomic", ...QueryString.decode(key) }), contents: JSON.stringify(rendered.state[key].node) }) )
        ])


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

module.exports = render
