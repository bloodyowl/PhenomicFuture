const React = require("react")
const QueryString = require("../shared/QueryString")

class Provider extends React.Component {
  constructor(props) {
    super(props)
    this.query = this.query.bind(this)
  }
  getChildContext() {
    return {
      store: this.props.store,
      query: this.query,
      __prerendering: !!this.props.__prerendering,
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
          .catch(error => {
            this.props.store.setAsError(key, error)
          })
      })
    )
      .then(
        this.props.onFetchComplete,
        this.props.onError
      )
  }
  render() {
    return React.Children.only(this.props.children)
  }
}

Provider.propTypes = {
  fetch: React.PropTypes.func.isRequired,
  store: React.PropTypes.object.isRequired,
  onFetchComplete: React.PropTypes.func,
  onError: React.PropTypes.func,
  __prerendering: React.PropTypes.bool,
}

Provider.childContextTypes = {
  query: React.PropTypes.func,
  store: React.PropTypes.object.isRequired,
  __prerendering: React.PropTypes.bool,
}

module.exports = Provider
