const buildURL = root => config =>
  `${ root }` +
  `${ config.url }${ config.limit ? `/${ config.limit }${ config.after ? `/${ config.after }` : `` }` : `` }.json`

module.exports = buildURL
