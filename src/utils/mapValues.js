const mapValues = (object, func) => {
  return Object.keys(object).reduce((acc, key) =>
    Object.assign(acc, {
      [key]: func(object[key])
    })
  , {})
}

module.exports = mapValues
