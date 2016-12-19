const levelUp = require("levelup")
const levelDown = require("leveldown")
const subLevel = require("level-sublevel")
const mapValues = require("../utils/mapValues")

const destruction = new Promise((resolve, reject) => {
  levelDown.destroy(".tmp/db", (error) => {
    if(error) {
      reject(error)
    } else {
      resolve()
    }
  })
})

const level = subLevel(levelUp(".tmp/db"))
const options = { valueEncoding: "json" }
const wrapStreamConfig = config => Object.assign({}, config, options)

function getSublevel (db, sub, filter, filterValue) {
  if(!Array.isArray(sub)) {
    sub = [ sub ]
  }
  if(filter) {
    sub = sub.concat(filter)
    if(filter !== "default" && filterValue) {
      sub = sub.concat(filterValue)
    }
  }
  return sub.reduce((db, name) => db.sublevel(name), db)
}

async function getDataRelation (fieldName, keys) {
  let partial = null
  try {
    if(Array.isArray(keys)) {
      partial = await Promise.all(keys.map(key => db.getPartial(fieldName, key)))
    } else {
      partial = await db.getPartial(fieldName, keys)
    }
    return partial
  } catch(error) {
    return keys
  }
}

async function getDataRelations (fields) {
  const keys = Object.keys(fields)
  const resolvedValues = await Promise.all(keys.map(key => getDataRelation(key, fields[key])))
  return keys.reduce((resolvedFields, key, index) => {
    resolvedFields[key] = resolvedValues[index]
    return resolvedFields
  }, {})
}

const db = {
  put(sub, key, value) {
    return new Promise((resolve, reject) => {
      const data = { ...value, key }
      const table = getSublevel(level, sub)
      return getSublevel(level, sub)
        .put(key, data, options, (error) => {
          if(error) {
            reject(error)
            return
          } else {
            resolve(data)
          }
        })
    })
  },
  get(sub, key) {
    return new Promise((resolve, reject) => {
      return getSublevel(level, sub).get(key, options, async function (error, data) {
        if(error) {
          reject(error)
        } else {
          const { body, ...metadata } = data.data
          const relatedData = await getDataRelations(metadata)
          resolve({
            key: key,
            value: {
              ...relatedData,
              body,
            },
          })
        }
      })
    })
  },
  getPartial(sub, key) {
    return new Promise((resolve, reject) => {
      return getSublevel(level, sub).get(key, options, (error, data) => {
        if(error) {
          reject(error)
        } else {
          resolve({ id: key, ...data.partial })
        }
      })
    })
  },
  getList(sub, config, filter = "default", filterValue) {
    return new Promise((resolve, reject) => {
      const array = []
      getSublevel(level, sub, filter, filterValue).createReadStream(wrapStreamConfig(config))
        .on("data", async function (data) {
          array.push(
            db.getPartial(sub, data.value.id)
              .then(value => ({
                ...value,
                key: data.key,
              }))
          )
        })
        .on("end", async function () {
          const returnValue = await Promise.all(array)
          resolve(returnValue)
        })
        .on("error", (error) => {
          reject(error)
        })
    })
  }
}

module.exports = mapValues(db, (method) => {
  return async function (...args) {
    await destruction
    return method(...args)
  }
})
