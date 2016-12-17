const createSitemap = require("../sitemap")

describe("createSitemap", () => {

  it("should generate a XML sitemap", () => {
    return createSitemap(["a", "b"])
      .then(xml => expect(xml).toMatchSnapshot())
  })

})
