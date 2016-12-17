const sm = require("sitemap")

const createSitemap = urls => new Promise((resolve, reject) => {
  sm.createSitemap({
    hostname: "https://putaindecode.io",
    cacheTime: 600000,
    urls: urls.map(url => ({ url })),
  })
  .toXML((error, xml) => {
    if(error) {
      reject(error)
    } else {
      resolve(xml)
    }
  })
})

module.exports = createSitemap
