const createRSS = require("../feed")

const posts = [
  {
    title: "a",
    url: "foo",
    description: "bar",
    categories: ["a", "b"],
    author: "bloodyowl",
    date: "2016-12-17",
  },
  // this one should be filtered (too old)
  {
    title: "should not appear",
    url: "foo",
    description: "bar",
    categories: ["a", "b"],
    author: "bloodyowl",
    date: "2015-12-16",
  },
]

describe("createRSS", () => {

  it("should generate a RSS feed", () => {
    return createRSS(posts)
      .then(xml => expect(xml).toMatchSnapshot())
  })

  it("should filter old items in feed", () => {
    return createRSS(posts)
      .then(xml => expect(xml).not.toContain("should not appear"))
  })

})
