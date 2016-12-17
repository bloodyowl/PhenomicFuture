const buildURL = require("../buildURL")

describe("buildURL", () => {

  it("should build URLs", () => {
    const toURL = buildURL("ROOT")

    expect(toURL({ url: "/test" })).toMatchSnapshot()
    expect(toURL({ url: "/test", limit: 10 })).toMatchSnapshot()
    expect(toURL({ url: "/test", limit: 10, after: "test" })).toMatchSnapshot()
  })

})
