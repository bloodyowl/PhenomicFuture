/**
 * This React component doesn't make anything other than rendering its children.
 *
 * It's just a way for us to make sure we can read the top-level
 * route configuration.
 */
const React = require("react")

const PhenomicRenderer = (props) => (
  <div
    {...props}
  />
)

module.exports = PhenomicRenderer
