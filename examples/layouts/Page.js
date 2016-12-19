const React = require("react")
const createContainer = require("../../src/client/hoc/Container")
const query = require("../../src/client/query")

const Link = require("react-router/Link").default

const Page = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <h1>
          {"PAGE " + props.page.title}
        </h1>
        <div
          dangerouslySetInnerHTML={{ __html: props.page.body }}
        />
      </div>
    }
  </div>
)

module.exports = createContainer(Page, props => ({
  page: query({
    collection: "pages",
    id: props.location.pathname.replace(/^\//, ""),
  }),
}))
