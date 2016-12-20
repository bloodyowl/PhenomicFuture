const React = require("react")

function getRoutes(app) {
  return React.Children
    .toArray(app.props.children)
    .filter(child => child.props.collection || child.props.pattern)
    .map(route => ({
      collection: route.props.collection,
      pattern: route.props.pattern,
      getQuery: route.props.component.getQueries,
    }))
}

module.exports = getRoutes
