const path = require("path")
const deburr = require("lodash.deburr")
const kebabCase = require("lodash.kebabcase")
const frontMatter = require("front-matter")
const marked = require("marked")

marked.setOptions({
  highlight (code) {
    return require('highlight.js').highlightAuto(code).value
  },
})

async function transformFile (file, contents) {
  switch(path.extname(file.name)) {
    case ".md":
      return transformMarkdownFile(file, contents)
    case ".json":
      return transformJSONFile(file, contents)
    default:
      return file
  }
}

async function transformMarkdownFile(file, contents) {
  const front = frontMatter(contents)
  const partial = {
    ...front.attributes,
    tags: (front.attributes.tags || []).map(tag => kebabCase(deburr(tag))),
  }
  const data = {
    ...partial,
    body: marked(front.body),
  }
  return {
    data,
    partial,
  }
}

async function transformJSONFile(file, contents) {
  const data = {
    ...JSON.parse(contents),
    path: path.basename(file.name, ".json"),
  }
  const { body, ...partial } = data
  return {
    data,
    partial,
  }
}

module.exports = transformFile
