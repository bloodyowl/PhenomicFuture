const fs = require("fs")

const readFile = (path) => new Promise((resolve, reject) => {
  fs.readFile(path, (error, file) => {
    if(error) {
      reject(error)
    } else {
      resolve(file.toString())
    }
  })
})

module.exports = readFile
