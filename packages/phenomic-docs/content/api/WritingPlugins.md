---
title: Writing plugins
path: plugins
tags:
  - plugins
---

A plugin should export a function exporting an object containing methods :

```javascript
const plugin = {
  type: "transform",
  supportedFileTypes: [ "json" ],
  transform(file, contents) {
    // should return an object of shape `{ partial, data }`
    return objectOfPromise
  },
}

const plugin = {
  type: "api",
  define(api, db) {
    api.get("/:collection/item/*.json", async function (req, res) {
      try {
        const resource = await db.get(req.params.collection, req.params[0])
        res.json(resource.value)
      } catch (error) {
        console.error(error)
        res.status(404).end()
      }
    })
  },
}

const plugin = {
  type: "api",
  build() {

  },
  define(api, db) {
    api.get("/feed.xml", async function (req, res) {
      db.getLatest()
    })
  },
}
```
