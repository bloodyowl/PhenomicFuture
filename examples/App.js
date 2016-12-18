const React = require("react")
const Match = require("react-router/Match").default
const Miss = require("react-router/Miss").default
const Link = require("react-router/Link").default

const Author = require("./layouts/Author")
const PostList = require("./layouts/PostList")
const Post = require("./layouts/Post")
const Home = require("./layouts/Home")
const Error404 = require("./layouts/Error404")
const TagList = require("./layouts/TagList")
const TagPostList = require("./layouts/TagPostList")

const AppContainer = require("../src/client/AppContainer")

require("./defaults.css")

module.exports = (
  <AppContainer>
    <Link to="/" activeOnlyWhenExact activeStyle={{ color: "red" }}>
      <h1 style={{ background: "#ccc", margin: 0 }}>Putain de code</h1>
    </Link>
    <Match exactly pattern="/" component={Home} />
    <Match exactly pattern="/post-list/:after?" paginated component={PostList} />
    <Match exactly pattern="/author/:key/:after?" paginated component={Author} forEach="authors" />
    <Match exactly pattern="/tags" component={TagList} />
    <Match exactly pattern="/tag/:key/:after?" paginated component={TagPostList} forEach="tags" />
    <Match exactly pattern="/404.html" component={Error404} />
    <Miss component={Post} forEach="posts" />
  </AppContainer>
)
