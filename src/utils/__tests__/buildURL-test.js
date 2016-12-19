const buildURL = require("../buildURL")

describe("buildURL", () => {

  it("should build URLs", () => {
    const toURL = buildURL("ROOT")

    expect(toURL({ collection: "posts", id: "test" })).toMatchSnapshot()
    expect(toURL({ collection: "posts", by: "tag", value: "test" })).toMatchSnapshot()
    expect(toURL({ collection: "posts", by: "tag", value: "test", order: "asc" })).toMatchSnapshot()
    expect(toURL({ collection: "posts", by: "tag", value: "test", order: "asc", limit: 10 })).toMatchSnapshot()
    expect(toURL({ collection: "posts", by: "tag", value: "test", order: "asc", limit: 10, after: "BASE64" })).toMatchSnapshot()
  })

})
