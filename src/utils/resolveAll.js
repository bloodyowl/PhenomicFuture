const resolveAll = (objectOfPromises) => {
  const finalObject = {}
  return Promise.all(Object.keys(objectOfPromises).map(key =>
    Promise.resolve(objectOfPromises[key])
      .then(value => finalObject[key] = value)
  ))
    .then(() => finalObject)
}

module.exports = resolveAll
