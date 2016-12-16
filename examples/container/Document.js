const React = require("react")

const Document = (props) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      {props.head && props.head.title.toComponent()}
      {props.head && props.head.meta.toComponent()}
      {props.head && props.head.link.toComponent()}
      <style>{`
        body {
          margin: 0;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
      `}</style>
    </head>
    <body>
      <div
        dangerouslySetInnerHTML={{ __html: props.body }}
      />
      <script id="Hydration" type="text/json">
        {JSON.stringify(props.state)}
      </script>
      <script src="/bundle.js"></script>
    </body>
  </html>
)

module.exports = Document
