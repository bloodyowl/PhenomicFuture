const React = require("react")
const QueryString = require("../utils/QueryString")

class Provider extends React.Component {
  constructor(props) {
    super(props)
    this.query = this.query.bind(this)
  }
  getChildContext() {
    return {
      store: this.props.store,
      query: this.query,
      isPrerendering: !!this.props.isPrerendering,
    }
  }
  query(queries) {
    Promise.all(
      queries.map(key => {
        this.props.store.setAsLoading(key)
        return this.props.fetch(QueryString.decode(key))
          .then(value => {
            this.props.store.set(key, value)
          })
      })
    )
      .then(() => {
        if(typeof this.props.onFetched === "function") {
          this.props.onFetched()
        }
      })
  }
  render() {
    return React.Children.only(this.props.children)
  }
}

Provider.childContextTypes = {
  query: () => {},
  store: () => {},
  isPrerendering: () => {},
}

module.exports = Provider
