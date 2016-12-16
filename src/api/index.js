const express = require("express")

const Database = require("../db")

const server = express()

const mapPostsToMetadata = posts => posts.map(post => ({
  title: post.value.title,
  url: "/" + post.value.path,
  authors: post.value.authors,
}))

const mapAuthorsToMetadata = authors => authors.map(author => author.value)
const mapTagsToMetadata = tags => tags.map(tags => author.value)

const mapPageToMetadata = pages => posts.map(page => ({
  url: "/" + page.value.path,
}))

const connect = (array, list, limit) => {
  const hasNextPage = limit === undefined ? false : list.length >= limit
  return {
    hasNextPage,
    next: hasNextPage ? new Buffer(array[array.length - 2].key).toString("base64") : null,
    list: list.slice(0, limit),
  }
}

server.get("/api", (req, res) => {
  res.json({
    website: "putaindecode.io",
    engine: "phenomic",
    version: "1.0.0",
  })
})

// Internal use only
server.get("/api/pages.json", (req, res) => {
  Database.getPages()
    .then(pages => res.json(mapPageToMetadata(pages)))
})

server.get("/api/page/*.json", (req, res) => {
  Database.get("pages", req.params[0])
    .then(page => res.json(page))
})

server.get("/api/posts.json", (req, res) => {
  Database.getPostList()
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts))))
})

server.get("/api/posts/:limit.json", (req, res) => {
  Database.getPostList({ limit: parseInt(req.params.limit) + 1 })
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))))
})

server.get("/api/posts/:limit/:after.json", (req, res) => {
  Database.getPostList({ limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))))
})

server.get("/api/post/*.json", (req, res) => {
  Database.get("posts", req.params[0])
    .then(post => {
      return Promise.all(post.value.authors.map(author => Database.get("authors", author).catch(error => ({ username: author }))))
        .then(authors => Object.assign({}, post.value, { authors }))
    })
    .then(post => res.json(post))
})

server.get("/api/authors.json", (req, res) => {
  Database.getAuthorList()
    .then(authors => res.json(connect(authors, mapAuthorsToMetadata(authors))))
})

server.get("/api/authors/:limit.json", (req, res) => {
  Database.getAuthorList({ limit: parseInt(req.params.limit) + 1 })
    .then(authors => res.json(connect(authors, mapAuthorsToMetadata(authors), parseInt(req.params.limit))))
})

server.get("/api/authors/:limit/:after.json", (req, res) => {
  Database.getAuthorList({ limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(authors => res.json(connect(authors, mapAuthorsToMetadata(authors), parseInt(req.params.limit))))
})

server.get("/api/author/*.json", (req, res) => {
  Database.get("authors", req.params[0])
    .then(author => res.json(author))
})

server.get("/api/author-posts/:author.json", (req, res) => {
  Database.getPostsByAuthor(req.params.author)
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts))))
})

server.get("/api/author-posts/:author/:limit.json", (req, res) => {
  Database.getPostsByAuthor(req.params.author, { limit: parseInt(req.params.limit) + 1 })
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))))
})

server.get("/api/author-posts/:author/:limit/:after.json", (req, res) => {
  Database.getPostsByAuthor(req.params.author, { limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))))
})

server.get("/api/tags.json", (req, res) => {
  Database.getTagList()
    .then(tags => res.json(connect(tags, mapTagsToMetadata(tags))))
})

server.get("/api/tags/:limit.json", (req, res) => {
  Database.getTagList({ limit: parseInt(req.params.limit) + 1 })
    .then(tags => res.json(connect(tags, mapTagsToMetadata(tags), parseInt(req.params.limit))))
})

server.get("/api/tags/:limit/:after.json", (req, res) => {
  Database.getTagList({ limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(tags => res.json(connect(tags, mapTagsToMetadata(tags), parseInt(req.params.limit))))
})

server.get("/api/tag/*.json", (req, res) => {
  Database.getPostsByTag(req.params[0])
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts))))
})

server.get("/api/tag/:limit.json", (req, res) => {
  Database.getPostsByTag(req.params[0], { limit: parseInt(req.params.limit) + 1 })
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))))
})

server.get("/api/tag/:limit/:after.json", (req, res) => {
  Database.getPostsByTag(req.params[0], { limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))))
})

server.listen(1414)

module.exports = server
