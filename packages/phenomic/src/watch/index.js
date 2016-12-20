const watchman = require("fb-watchman")
const path = require("path")

const createErrorHandler = client => error => {
  if(error) {
    client.end()
    throw error
  }
}

function getExtensionsToWatch(plugins) {
  return plugins.reduce((acc, plugin) => {
    if(Array.isArray(plugin.supportedFileTypes)) {
      acc.push(...plugin.supportedFileTypes)
    }
    return acc
  }, [])
}

function createWatcher(config) {
  const client = new watchman.Client()
  const handleError = createErrorHandler()
  let subscribers = []
  let files = {}
  client.capabilityCheck({ optional: [], required: ["relative_root"] }, (error) => {
    handleError(error)
    client.command(["watch-project", config.path], (error, response) => {
      handleError(error)

      const subcription = {
        expression: [
          "anyof",
          ...getExtensionsToWatch(config.plugins).map(extension => ["match", `*.${ extension }`])
        ],
        fields: ["name", "exists", "type"],
        relative_root: response.relative_path,
      }

      client.command(["subscribe", response.watch, "files", subcription], handleError)

      client.on("subscription", (event) => {
        event.files.forEach(file => {
          if(files[file.name] && !file.exists) {
            delete files[file.name]
          } else {
            files[file.name] = {
              name: file.name,
              fullpath: path.join(config.path, file.name),
              exists: file.exists,
              type: file.type,
            }
          }
        })
        const arrayOfFiles = Object.keys(files).map(key => files[key])
        subscribers.forEach(func => func(arrayOfFiles))
      })
    })
  })

  return {
    onChange(func) {
      subscribers = [ ...subscribers, func ]
      return function unsubscribe() {
        return subscribers = subscribers.filter(item => item !== func)
      }
    },
    close() {
      subscribers = []
      client.end()
    },
  }
}

module.exports = createWatcher
