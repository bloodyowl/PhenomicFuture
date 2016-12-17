const RSS = require("rss")
const createRSS = posts => new Promise((resolve, reject) => {
  const rss = new RSS({
    feed_url: "https://putaindecode.io",
  })
  posts
    .filter(post => Date.now() - new Date(post.date).getTime() < (1000 * 60 * 60 * 24 * 365))
    .forEach(post => {
      rss.item({
        title: post.title,
        url: "https://putaindecode.io" + post.path,
        description: post.content,
        categories: post.tags,
        author: post.author,
        date: post.date,
      })
    })
  resolve(rss.xml())
})

module.exports = createRSS
