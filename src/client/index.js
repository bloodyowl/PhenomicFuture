const React = require("react")
const ReactDOM = require("react-dom")
const BrowserRouter = require("react-router/BrowserRouter").default

const app = require("../../examples/App")
const Provider = require("./Provider")

const createStore = require("./Store")
const buildURL = require("../utils/buildURL")

const toURL = buildURL("/api")
const clientFetch = (a) => {
  return fetch(toURL(a)).then(res => res.json())
}

const initialStateNode = document.getElementById("Hydration")
const store = createStore(initialStateNode && initialStateNode.textContent ? JSON.parse(initialStateNode.textContent) : null)

ReactDOM.render(
  <Provider
    fetch={clientFetch}
    store={store}
  >
    <BrowserRouter>
      {app}
    </BrowserRouter>
  </Provider>,
  document.getElementById("PhenomicRoot")
)
