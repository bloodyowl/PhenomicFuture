import React from "react"
import Match from "react-router/Match"
import Miss from "react-router/Miss"
import Link from "react-router/Link"

import Header from "./components/Header"
import Home from "./components/Home"
import DocPage from "./components/DocPage"
import APIPage from "./components/APIPage"
import APIListPage from "./components/APIListPage"
import ChangelogPage from "./components/ChangelogPage"
import ChangelogListPage from "./components/ChangelogListPage"
import ShowcaseList from "./components/ShowcaseList"

const PhenomicRenderer = require("../src/client/hoc/Renderer")

require("./defaults.css")

module.exports = (
  <PhenomicRenderer>
    <Header />
    <Match exactly pattern="/" component={Home} />
    <Match exactly pattern="/api" component={APIListPage} />
    <Match exactly pattern="/api/*" component={APIPage} collection="api" />
    <Match exactly pattern="/changelog/*" component={ChangelogPage} collection="changelog" />
    <Match exactly pattern="/changelog" component={ChangelogListPage} />
    <Match exactly pattern="/docs/*" component={DocPage} collection="docs" />
    <Match exactly pattern="/showcase" component={ShowcaseList} collection="showcase" />
  </PhenomicRenderer>
)
