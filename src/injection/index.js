const Database = require("../db")

const frontMatter = require("front-matter")
const marked = require("marked")
const path = require("path")

const Injection = {
  injectAuthor : file => {
    const author = JSON.parse(file.contents)
    return Database.put("authors", file.name, author)
  },
  injectPage : file => {
    const front = frontMatter(file.contents)
    const parsed = Object.assign(front.attributes, {
      content: marked(front.body),
    })
    return Database.put(
      "pages",
      front.attributes.path || path.join(path.dirname(file.name), path.basename(file.name, ".md") + ".html"),
      parsed
    )
  },
  injectPost : file => {
    const front = frontMatter(file.contents)
    const parsed = Object.assign(
      { tags: [] },
      front.attributes,
      { content: marked(front.body) }
    )
    if(isNaN(new Date(front.attributes.date).getTime())) {
      console.error(
        "All posts must have a `date`, " +
        path.join(path.dirname(file.name), path.basename(file.name, ".md")) +
        " did not."
      )
    }
    if(!Array.isArray(front.attributes.authors)) {
      console.error(
        "All posts must have a valid `authors`, " +
        path.join(path.dirname(file.name), path.basename(file.name, ".md")) +
        " did not."
      )
    }
    const postPath = parsed.path || path.join(path.dirname(file.name), file.name.endsWith("index.md") ? "" : path.basename(file.name, ".md"))
    return Promise.all([
      Database.put(
        "post-dates",
        front.attributes.date + "-" + postPath,
        postPath
      ),
      Database.put(
        "posts",
        postPath,
        Object.assign(parsed, { path: postPath })
      ),
      ...front.attributes.authors.map(author =>
        Database.put(
          ["posts-by-author", author],
          front.attributes.date + "-" + postPath,
          postPath
        )
      ),
      ...front.attributes.tags.map(tag =>
        Database.put(
          ["posts-by-tags", tag],
          front.attributes.date + "-" + postPath,
          postPath
        )
      ),
      ...front.attributes.tags.map(tag =>
        Database.put(
          "tags",
          tag,
          true
        )
      ),
    ])
  },
}

module.exports = Injection
