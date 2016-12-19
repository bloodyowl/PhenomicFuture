const React = require("react")

const Document = (props) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      {props.head && props.head.title.toComponent()}
      {props.head && props.head.meta.toComponent()}
      {props.head && props.head.link.toComponent()}
    </head>
    <body>
      <div
        dangerouslySetInnerHTML={{ __html: props.body }}
      />
      <script
        id="Hydration"
        type="text/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(props.state),
        }}
      />
      <script src="/bundle.js" async></script>
    </body>
  </html>
)

module.exports = Document
