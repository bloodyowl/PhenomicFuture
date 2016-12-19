const express = require("express")

const db = require("../db")

const api = express()

const encode = text => new Buffer(text).toString("base64")
const decode = text => new Buffer(text, "base64").toString()


const connect = (list, limit) => {
  const hasNextPage = limit === undefined ? false : list.length >= limit
  return {
    hasNextPage,
    next: hasNextPage ? encode(list[list.length - 2].key) : null,
    list: list.slice(0, limit),
  }
}

api.get("/", async function (req, res) {
  res.json({
    engine: "phenomic",
    version: "1.0.0",
  })
})

api.get("/:collection/by-:filter/:value/:sort.json", async function (req, res) {
  try {
    const reverse = req.params.sort === "desc"
    const list = await db.getList(req.params.collection, { reverse }, req.params.filter, req.params.value)
    res.json(connect(list))
  } catch (error) {
    console.error(error)
    res.status(404).end()
  }
})

api.get("/:collection/by-:filter/:value/:sort/limit-:limit.json", async function (req, res) {
  try {
    const limit = parseInt(req.params.limit)
    const reverse = req.params.sort === "desc"
    const list = await db.getList(req.params.collection, { limit: limit + 1, reverse }, req.params.filter, req.params.value)
    res.json(connect(list, limit))
  } catch (error) {
    console.error(error)
    res.status(404).end()
  }
})

api.get("/:collection/by-:filter/:value/:sort/limit-:limit/after-:after.json", async function (req, res) {
  try {
    const limit = parseInt(req.params.limit)
    const lt = decode(req.params.after)
    const reverse = req.params.sort === "desc"
    const list = await db.getList(req.params.collection, { limit: limit + 1, lt, reverse }, req.params.filter, req.params.value)
    res.json(connect(list, limit))
  } catch (error) {
    console.error(error)
    res.status(404).end()
  }
})

api.get("/:collection/item/*.json", async function (req, res) {
  try {
    const resource = await db.get(req.params.collection, req.params[0])
    res.json(resource.value)
  } catch (error) {
    console.error(error)
    res.status(404).end()
  }
})

/* server.get("/api/post-related/:limit/*.json", (req, res) => {
  Database.get("posts", req.params[0])
    .then(post => {
      return Promise.all([
        ...post.value.tags.map(tag => Database.getPostsByTag(tag).catch(error => [])),
        Database.getPostList({ limit: parseInt(req.params.limit) + 1 })
      ])
        .then(lists => lists.reduce((acc, list) => acc.concat(list), []))
        .then(list => list.filter(item => item.value.path !== post.value.path))
        .then(list => {
          if(list.length < parseInt(req.params.limit)) {
            return null
          } else {
            return mapPostsToMetadata(list.slice(0, parseInt(req.params.limit)))
          }
        })
    })
    .then(
      tags => res.json(tags),
      error => {
        res.status(404).end()
      }
    )
})*/


const server = express()
server.use("/api", api)
server.listen(1414)

module.exports = server
