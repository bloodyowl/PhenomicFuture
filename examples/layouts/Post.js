const React = require("react")
const createContainer = require("../../src/client/createContainer")

const Link = require("react-router/Link").default

const Post = (props) => (
  <div>
    {props.isLoading &&
      <span>loading …</span>
    }
    {!props.isLoading &&
      <div>
        <h1>
          {props.post.title}
        </h1>
        <div
          dangerouslySetInnerHTML={{ __html: props.post.content }}
        />
        {Array.isArray(props.related) &&
          <div>
            <h2>You might also like</h2>
            {props.related.map(item =>
              <div key={item.url}>
                <Link to={item.url}>
                  {item.title}
                </Link>
              </div>
            )}
          </div>
        }
      </div>
    }
  </div>
)

module.exports = createContainer(Post, props => ({
  post: {
    url: `post${ props.location.pathname.replace(/\/$/, "") }`,
  },
  related: {
    url: `post-related/2${ props.location.pathname.replace(/\/$/, "") }`,
  },
}))
