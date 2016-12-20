const React = require("react")
const ReactDOM = require("react-dom")
const BrowserRouter = require("react-router/BrowserRouter").default
const Provider = require("../components/Provider")

const createStore = require("../shared/store")
const createURL = require("phenomic-api-client/lib/url")

function createFetchFunction() {
  return config => fetch(createURL(config)).then(res => res.json())
}

function bootstrap(app) {
  const initialStateNode = document.getElementById("Hydration")
  const store = createStore(
    initialStateNode && initialStateNode.textContent ?
      JSON.parse(initialStateNode.textContent) :
      undefined
  )

  ReactDOM.render(
    <Provider
      fetch={createFetchFunction()}
      store={store}
    >
      <BrowserRouter>
        {app}
      </BrowserRouter>
    </Provider>,
    document.getElementById("PhenomicRoot")
  )
}

module.exports = bootstrap
