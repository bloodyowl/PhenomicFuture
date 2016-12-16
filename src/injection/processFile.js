const Injection = require(".")
const readFile = require("../utils/readFile")
const path = require("path")

const processFile = file => {
  if(file.name.startsWith("authors")) {
    return readFile(file.fullpath)
      .then(contents =>
        Injection.injectAuthor({
          name: file.name,
          contents: contents,
        })
      )
  }
  if(file.name.startsWith("pages")) {
    return readFile(file.fullpath)
      .then(contents =>
        Injection.injectPage({
          name: file.name,
          contents: contents,
        })
      )
  }
  if(file.name.startsWith("posts") && path.extname(file.name) === ".md") {
    return readFile(file.fullpath)
      .then(contents =>
        Injection.injectPost({
          name: file.name,
          contents,
        })
      )
  }
  return Promise.resolve()
}

module.exports = processFile
