const React = require("react")
const createContainer = require("../../src/client/createContainer")

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
      </div>
    }
  </div>
)

module.exports = createContainer(Post, props => ({
  post: {
    url: `post${ props.location.pathname }`
  },
}))
