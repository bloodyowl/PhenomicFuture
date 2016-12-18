const React = require("react")
const createContainer = require("../../src/client/createContainer")

const Error404 = (props) => (
  <div>
    <h1>💨 nothing to see here</h1>
  </div>
)

module.exports = createContainer(Error404, () => ({}))
