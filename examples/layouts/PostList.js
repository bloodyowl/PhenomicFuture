const React = require("react")
const createContainer = require("../../src/client/createContainer")

const Link = require("react-router/Link").default

const PostList = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <ul>
          {props.posts.list.map(post =>
            <li key={post.url}>
              <Link to={post.url}>
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
      </div>
    }
  </div>
)

module.exports = createContainer(PostList, props => ({
  posts: { url: `posts`, limit: 20, after: props.params.after },
}))
