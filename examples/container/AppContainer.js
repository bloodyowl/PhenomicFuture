const React = require("react")

const AppContainer = (props) => (
  <div>
    <h1 style={{ background: "#ccc", margin: 0 }}>HEADER</h1>
    {props.children}
  </div>
)

module.exports = AppContainer
