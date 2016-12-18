const React = require("react")
const createContainer = require("../../src/client/createContainer")

const Link = require("react-router/Link").default

const Author = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <h1>
          {props.author.username}
        </h1>
        <pre>
          {props.author.fr.bio.long.join("\n")}
        </pre>
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
          <Link to={"/author/" + props.params.key + "/" + props.posts.next}>
            next
          </Link>
        }
      </div>
    }
  </div>
)

module.exports = createContainer(Author, props => ({
  author: {
    url: `author/${ props.params.key }`,
  },
  posts: {
    url: `author-posts/${ props.params.key }`,
    limit: 10,
    after: props.params.after,
  },
}))
