const React = require("react")
const createContainer = require("../../src/client/hoc/Container")
const query = require("../../src/client/query")

const Link = require("react-router/Link").default

const TagPostList = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <ul>
          {props.posts.list.map(post =>
            <li key={post.id}>
              <Link to={"/" + post.id}>
                {post.title}
              </Link>
            </li>
          )}
        </ul>
        {props.posts.hasNextPage &&
          <Link to={"/tag/" + props.params.key + "/" + props.posts.next}>
            next
          </Link>
        }
      </div>
    }
  </div>
)

module.exports = createContainer(TagPostList, props => ({
  posts: query({
    collection: "posts",
    by: "tags",
    value: props.params.key,
    limit: 20,
    after: props.params.after,
  }),
}))
