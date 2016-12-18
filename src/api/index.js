const express = require("express")

const Database = require("../db")

const server = express()

const mapPostsToMetadata = posts => posts.map(post => ({
  key: post.value.key,
  title: post.value.title,
  url: "/" + post.value.path,
  authors: post.value.authors,
}))

const mapAuthorsToMetadata = authors => {
  return authors.map(author => ({
    key: author.key,
    username: author.username,
  }))
}

const mapTagsToMetadata = tags => tags.map(tag => tag)

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
    .then(
      pages => res.json(mapPageToMetadata(pages)),
      error => res.status(404).end()
    )
})

server.get("/api/page/*.json", (req, res) => {
  Database.get("pages", req.params[0])
    .then(
      page => res.json(page),
      error => res.status(404).end()
    )
})

server.get("/api/posts.json", (req, res) => {
  Database.getPostList()
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts))),
      error => res.status(404).end()
    )
})

server.get("/api/posts/:limit.json", (req, res) => {
  Database.getPostList({ limit: parseInt(req.params.limit) + 1 })
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/posts/:limit/:after.json", (req, res) => {
  Database.getPostList({ limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/post/*.json", (req, res) => {
  Database.get("posts", req.params[0])
    .then(post => {
      return Promise.all(post.value.authors.map(author => Database.get("authors", author).catch(error => ({ username: author }))))
        .then(authors => Object.assign({}, post.value, { authors }))
    })
    .then(
      post => res.json(post),
      error => res.status(404).end()
    )
})

server.get("/api/post-related/:limit/*.json", (req, res) => {
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
})

server.get("/api/authors.json", (req, res) => {
  Database.getAuthorList()
    .then(
      authors => res.json(connect(authors, mapAuthorsToMetadata(authors))),
      error => res.status(404).end()
    )
})

server.get("/api/authors/:limit.json", (req, res) => {
  Database.getAuthorList({ limit: parseInt(req.params.limit) + 1 })
    .then(
      authors => res.json(connect(authors, mapAuthorsToMetadata(authors), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/authors/:limit/:after.json", (req, res) => {
  Database.getAuthorList({ limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(
      authors => res.json(connect(authors, mapAuthorsToMetadata(authors), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/author/*.json", (req, res) => {
  Database.get("authors", req.params[0])
    .then(
      author => res.json(author.value),
      error =>  res.status(404).end()
    )
})

server.get("/api/author-posts/:author.json", (req, res) => {
  Database.getPostsByAuthor(req.params.author)
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts))),
      error => res.status(404).end()
    )
})

server.get("/api/author-posts/:author/:limit.json", (req, res) => {
  Database.getPostsByAuthor(req.params.author, { limit: parseInt(req.params.limit) + 1 })
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/author-posts/:author/:limit/:after.json", (req, res) => {
  Database.getPostsByAuthor(req.params.author, { limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/tags.json", (req, res) => {
  Database.getTagList()
    .then(
      tags => res.json(connect(tags, mapTagsToMetadata(tags))),
      error => res.status(404).end()
    )
})

server.get("/api/tags/:limit.json", (req, res) => {
  Database.getTagList({ limit: parseInt(req.params.limit) + 1 })
    .then(
      tags => res.json(connect(tags, mapTagsToMetadata(tags), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/tags/:limit/:after.json", (req, res) => {
  Database.getTagList({ limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(
      tags => res.json(connect(tags, mapTagsToMetadata(tags), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/tag/:tag.json", (req, res) => {
  Database.getPostsByTag(req.params.tag)
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts))),
      error => res.status(404).end()
    )
})

server.get("/api/tag/:tag/:limit.json", (req, res) => {
  Database.getPostsByTag(req.params.tag, { limit: parseInt(req.params.limit) + 1 })
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.get("/api/tag/:tag/:limit/:after.json", (req, res) => {
  Database.getPostsByTag(req.params.tag, { limit: parseInt(req.params.limit) + 1, gt: new Buffer(req.params.after, "base64").toString() })
    .then(
      posts => res.json(connect(posts, mapPostsToMetadata(posts), parseInt(req.params.limit))),
      error => res.status(404).end()
    )
})

server.listen(1414)

module.exports = server
