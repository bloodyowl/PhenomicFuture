const watchman = require("fb-watchman")
const path = require("path")

const createErrorHandler = client => error => {
  if(error) {
    client.end()
    throw error
  }
}

const watch = (config) => {
  const client = new watchman.Client()
  const handleError = createErrorHandler()
  let isFirstBatch = true

  client.capabilityCheck({ optional: [], required: ["relative_root"] }, (error) => {
    handleError(error)
    client.command(["watch-project", config.path], (error, response) => {
      handleError(error)

      const subcription = {
        expression: ["anyof", ["match", "*.md"], ["match", "*.json"]],
        fields: ["name", "exists", "type"],
        relative_root: response.relative_path,
      }

      client.command(["subscribe", response.watch, "files", subcription], handleError)

      client.on("subscription", (event) => {
        event.files.forEach(file => {
          config.onFile({
            name: file.name,
            fullpath: path.join(config.path, file.name),
            exists: file.exists,
            type: file.type,
          })
        })
        if(isFirstBatch) {
          isFirstBatch = false
          if(typeof config.onFirstBatch === "function") {
            config.onFirstBatch(client)
          }
        }
      })
    })
  })
}

module.exports = watch
