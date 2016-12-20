function flattenConfiguration (config = {}) {
  const plugins = config.plugins || []
  const presets = config.presets || []
  return [
    ...plugins,
    ...presets
      .reduce((acc, preset) => {
        acc.push(...flattenConfiguration(preset))
        return acc
      }, []),
  ]
}

module.exports = flattenConfiguration
