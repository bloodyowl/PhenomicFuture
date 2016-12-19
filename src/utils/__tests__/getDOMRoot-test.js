const getDOMRoot = require("../getDOMRoot")

describe("getDOMRoot", () => {

  it("should generate a HTML string", () => {
    expect(getDOMRoot()).toMatchSnapshot()
  })

  it("should generate a HTML string with content", () => {
    expect(getDOMRoot("hey")).toMatchSnapshot()
  })

  it("should generate a HTML string with HTML content", () => {
    expect(getDOMRoot("<h1>hey</h1>")).toMatchSnapshot()
  })

})
