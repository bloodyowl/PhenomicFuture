const React = require("react")
const mapValues = require("../../utils/mapValues")
const QueryString = require("../../utils/QueryString")
const Redirect = require("react-router/Redirect").default

const emptyObject = {}
const defaultGetQueries = () => emptyObject

function createContainer(Component, getQueries = defaultGetQueries) {

  class PhenomicRouteContainer extends React.Component {

    constructor(props, context) {
      super(props, context)
      this.computeQueries(props)
      // if we're on the server, let's just run the query
      if(this.context.__prerendering) {
        this.query()
      }
    }

    componentDidMount() {
      if(!this.context.__prerendering) {
        this.query()
      }
      this.unsubscribe = this.context.store.subscribe(() => this.update())
    }

    componentWillUnmount() {
      this.unsubscribe()
      this.unsubscribe = null
    }

    componentWillReceiveProps(props) {
      this.computeQueries(props)
      this.schedule(() => this.query())
    }

    update() {
      this.schedule(() => this.forceUpdate())
    }

    schedule(func) {
      requestAnimationFrame(() => {
        if(this.unsubscribe) {
          func()
        }
      })
    }

    computeQueries(props) {
      this.queries = mapValues(getQueries(props), value => QueryString.encode(value))
    }

    query() {
      const store = this.context.store
      const values = Object.keys(this.queries).map(key => this.queries[key])
      this.context.query(values.filter(item => store.get(item).status !== "idle"))
    }

    render() {
      const store = this.context.store
      const values = Object.keys(this.queries).map(key => this.queries[key])
      const isLoading = values.some(item => store.get(item).status !== "idle")
      const hasErrored = values.some(item => store.get(item).status === "error")
      const props = mapValues(this.queries, (value, key) => store.get(this.queries[key]).node)
      if(hasErrored) {
        return (
          <Redirect
            to="/404.html"
          />
        )
      }
      return (
        <Component
          {...this.props}
          isLoading={isLoading}
          {...props}
        />
      )
    }
  }

  PhenomicRouteContainer.getQueries = getQueries

  PhenomicRouteContainer.contextTypes = {
    query: React.PropTypes.func,
    store: React.PropTypes.object,
    __prerendering: React.PropTypes.bool,
  }

  return PhenomicRouteContainer

}

module.exports = createContainer
