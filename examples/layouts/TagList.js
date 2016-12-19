const React = require("react")
const createContainer = require("../../src/client/createContainer")
const query = require("../../src/client/query")

const Link = require("react-router/Link").default

const TagList = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <ul>
          {props.tags.list.map(tag =>
            <li key={tag.key}>
              <Link to={"./tag/" + tag.key}>
                {tag.key}
              </Link>
            </li>
          )}
        </ul>
      </div>
    }
  </div>
)

module.exports = createContainer(TagList, props => ({
  tags: query({
    collection: "tags",
  }),
}))
