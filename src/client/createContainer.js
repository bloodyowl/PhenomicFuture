const React = require("react")
const mapValues = require("../utils/mapValues")
const QueryString = require("../utils/QueryString")

const createContainer = (Component, getQueries) => {
  class Container extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.saveQueries(props)
      if(this.context.isPrerendering) {
        this.query()
      }
    }
    componentDidMount() {
      this.query()
      this.unsubscribe = this.context.store.subscribe(() => this.update())
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
    componentWillUnmount() {
      this.unsubscribe()
      this.unsubscribe = null
    }
    componentWillReceiveProps(props) {
      this.saveQueries(props)
      this.schedule(() => this.query())
    }
    saveQueries(props) {
      this.queries = mapValues(getQueries(props), value => QueryString.encode(value))
    }
    query() {
      const store = this.context.store
      const values = Object.keys(this.queries).map(key => this.queries[key])
      this.context.query(values.filter(item => store.get(item).status !== "idle"))
    }
    render() {
      const values = Object.keys(this.queries).map(key => this.queries[key])
      const store = this.context.store
      const isLoading = values.some(item => store.get(item).status !== "idle")
      const props = Object.keys(this.queries)
        .reduce((acc, key) => Object.assign(acc, { [ key ]: store.get(this.queries[key]).value }), {})
      return (
        <Component
          isLoading={isLoading}
          {...props}
        />
      )
    }
  }

  Container.__isContainer = true
  Container.getQueries = getQueries

  Container.contextTypes = {
    query: () => {},
    store: () => {},
    isPrerendering: () => {},
  }

  return Container
}

module.exports = createContainer
