const levelUp = require("levelup")
const subLevel = require("level-sublevel")
const mapValues = require("../utils/mapValues")

const destruction = new Promise((resolve, reject) => {
  require("leveldown").destroy(".tmp/db", (error) => {
    if(error) {
      reject(error)
    } else {
      resolve()
    }
  })
})

const db = subLevel(levelUp(".tmp/db"))
const options = { valueEncoding: "json" }
const wrapStreamConfig = config => Object.assign({}, config, options)

const getSublevel = (db, sub) => {
  if(!Array.isArray(sub)) {
    sub = [ sub ]
  }
  return sub.reduce((db, name) => db.sublevel(name), db)
}

const Database = {
  put(sub, key, value) {
    return new Promise((resolve, reject) => {
      return getSublevel(db, sub).put(key, Object.assign({}, value, { key }), options, (error) => {
        if(error) {
          reject(error)
          return
        } else {
          resolve(Object.assign({}, value, { key }))
        }
      })
    })
  },
  get(sub, key) {
    return new Promise((resolve, reject) => {
      return getSublevel(db, sub).get(key, options, (error, value) => {
        if(error) {
          reject(error)
          return
        } else {
          resolve({ key: key, value: value })
        }
      })
    })
  },
  getPostList(config) {
    return new Promise((resolve, reject) => {
      const array = []
      db.sublevel("post-dates").createReadStream(wrapStreamConfig(config))
        .on("data", function (data) {
          array.push(
            Database.get("posts", data.value.value).then(post => ({ value: post.value, key: data.key }))
          )
        })
        .on("end", () => {
          Promise.all(array)
            .then(resolve)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  },
  getAuthorList(config) {
    return new Promise((resolve, reject) => {
      const array = []
      getSublevel(db, "authors").createReadStream(wrapStreamConfig(config))
        .on("data", function (data) {
          array.push(data.value)
        })
        .on("end", () => {
          resolve(array)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  },
  getPostsByAuthor(author, config) {
    return new Promise((resolve, reject) => {
      const array = []
      getSublevel(db, ["posts-by-author", author]).createReadStream(wrapStreamConfig(config))
        .on("data", function (data) {
          array.push(
            Database.get("posts", data.value.value).then(post => ({ value: post.value, key: data.key }))
          )
        })
        .on("end", () => {
          Promise.all(array)
            .then(resolve)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  },
  getPostsByTag(tag, config) {
    return new Promise((resolve, reject) => {
      const array = []
      getSublevel(db, ["posts-by-tags", tag]).createReadStream(wrapStreamConfig(config))
        .on("data", function (data) {
          array.push(
            Database.get("posts", data.value.value).then(post => ({ value: post.value, key: data.key }))
          )
        })
        .on("end", () => {
          Promise.all(array)
            .then(resolve)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  },
  getPages(config) {
    return new Promise((resolve, reject) => {
      const array = []
      db.sublevel("pages").createReadStream(wrapStreamConfig(config))
        .on("data", function (data) {
          array.push(data.key)
        })
        .on("end", () => {
          resolve(array)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  },
  getTagList(config) {
    return new Promise((resolve, reject) => {
      const array = []
      db.sublevel("tags").createReadStream(wrapStreamConfig(config))
        .on("data", function (data) {
          array.push(data.value)
        })
        .on("end", () => {
          resolve(array)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  },
}


module.exports = mapValues(Database, (method) => {
  return (a, b, c) => {
    return destruction
      .then(() => method(a, b, c))
  }
})
