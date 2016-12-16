const React = require("react")
const createContainer = require("../../src/client/createContainer")

const Link = require("react-router/Link").default

const Home = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <h2>Hello there</h2>
        <ul>
          {props.posts.list.map(post =>
            <li key={post.url}>
              <Link to={post.url}>
                {post.title}
              </Link>
            </li>
          )}
        </ul>
        <Link to={"/post-list"}>
          voir tous les articles
        </Link>
      </div>
    }
  </div>
)

module.exports = createContainer(Home, props => ({
  posts: {
    url: `posts`,
    limit: 20,
  },
}))
