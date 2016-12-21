const phenomic = require("phenomic")
const path = require("path")

phenomic.build({
  path: path.resolve(__dirname, ".."),
  outdir: path.resolve(__dirname, "../dist"),
  bundler: require("phenomic-webpack"),
  renderer: require("phenomic-react"),
  plugins: [
    require("phenomic-plugin-transform-markdown"),
  ],
})
  .then(
    () => console.log("done"),
    (error) => console.error(error)
  )
