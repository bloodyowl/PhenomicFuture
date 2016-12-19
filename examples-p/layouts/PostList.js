const React = require("react")
const createContainer = require("../../src/client/hoc/Container")
const query = require("../../src/client/query")

const Link = require("react-router/Link").default
const TagList = require("./TagList")

const PostList = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <ul>
          {props.posts.list.map(post =>
            <li key={post.id}>
              <Link to={"/post/" + post.id}>
                {post.title}
              </Link>
            </li>
          )}
        </ul>
        {props.posts.hasNextPage &&
          <Link to={"/post-list/" + props.posts.next}>
            next
          </Link>
        }
        <h2>Tags</h2>
        {props.tags.list.map(tag => 
          <span key={tag.id}>
            {tag.id + " "}
          </span>
        )}
      </div>
    }
  </div>
)

module.exports = createContainer(PostList, props => ({
  posts: query({
    collection: "posts",
    limit: 20,
    after: props.params.after,
  }),
  tags: query({
    collection: "tags",
    order: "asc",
  }),
}))
