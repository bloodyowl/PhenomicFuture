const React = require("react")
const createContainer = require("../../src/client/hoc/Container")
const query = require("../../src/client/query")

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
            <li key={post.id}>
              <Link to={"/post/" + post.id}>
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
  posts: query({
    collection: "posts",
    limit: 20,
  }),
}))
