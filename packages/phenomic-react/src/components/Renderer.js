/**
 * This React component doesn't make anything other than rendering its children.
 *
 * It's just a way for us to make sure we can read the top-level
 * route configuration.
 */
const React = require("react")

const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
)

class PhenomicRenderer extends React.Component {
  render() {
    return (
      <div
        {...this.props}
      />
    )
  }
}

PhenomicRenderer.render = function(app) {
  if(canUseDOM) {
    require("../runtime/bootstrap")(app)
  }
}

module.exports = PhenomicRenderer
