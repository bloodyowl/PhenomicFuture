const React = require("react")
const createContainer = require("../../src/client/hoc/Container")
const query = require("../../src/client/query")

const Link = require("react-router/Link").default

const PageList = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <ul>
          {props.pages.list.map(page =>
            <li key={page.id}>
              <Link to={"/" + page.id}>
                {page.title}
              </Link>
            </li>
          )}
        </ul>
        {props.pages.hasNextPage &&
          <Link to={"/pages/" + props.posts.next}>
            next
          </Link>
        }
      </div>
    }
  </div>
)

module.exports = createContainer(PageList, props => ({
  pages: query({
    collection: "pages",
    limit: 20,
    after: props.params.after,
  }),
}))
