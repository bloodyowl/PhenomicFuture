const React = require("react")
const Match = require("react-router/Match").default
const Miss = require("react-router/Miss").default
const Link = require("react-router/Link").default

const PostList = require("./layouts/PostList")
const Post = require("./layouts/Post")
const Home = require("./layouts/Home")

const AppContainer = require("../src/client/AppContainer")

require("./defaults.css")

module.exports = (
  <AppContainer>
    <Link to="/" activeOnlyWhenExact activeStyle={{ color: "red" }}>
      <h1 style={{ background: "#ccc", margin: 0 }}>Putain de code</h1>
    </Link>
    <Match exactly pattern="/" component={Home} />
    <Match exactly pattern="/post-list/:after?" paginated component={PostList} />
    <Miss component={Post} />
  </AppContainer>
)
