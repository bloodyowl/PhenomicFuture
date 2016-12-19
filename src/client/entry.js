const React = require("react")
const ReactDOM = require("react-dom")
const BrowserRouter = require("react-router/BrowserRouter").default

const app = require("../../examples/App")
const Provider = require("./hoc/Provider")

const createStore = require("./store")
const buildURL = require("../utils/buildURL")

function createFetchFunction() {
  const toURL = buildURL("/api")
  return url => fetch(toURL(url)).then(res => res.json())
}

const initialStateNode = document.getElementById("Hydration")
const store = createStore(initialStateNode && initialStateNode.textContent ? JSON.parse(initialStateNode.textContent) : undefined)

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
