const resolveURLsForDynamicParams = async function (fetch, route) {
  if(!route.props.forEach) {
    return route
  }
  const collection = await fetch({ url: route.props.forEach })
  const pattern = (route.props.pattern || ":key")
  return collection.list.map(item => Object.assign({}, item, { props: Object.assign({}, route.props, { pattern: pattern.replace(":key", item.key), params: { key: item.key } }) }))
}

const findPaginatedQuery = function (queries) {
  const key = Object.keys(queries).find(key => queries[key].hasOwnProperty("after"))
  return queries[key]
}

const resolveNextURLsInPagination = async function (pattern, query, fetch, urls = []) {
  urls = [ ...urls, pattern.replace("/:after?", query.after ? "/" + query.after : "") ]
  const nextPage = await fetch(query)
  if(nextPage.hasNextPage) {
    return resolveNextURLsInPagination(
      pattern,
      Object.assign({}, query, { after: nextPage.next }),
      fetch,
      urls
    )
  } else {
    return urls
  }
}

const resolvePaginatedURLs = async function (fetch, route) {
  if(!route.props.paginated) {
    return route.props.pattern
  }
  if(!route.props.component.getQueries) {
    return route.props.pattern
  }
  const initialRouteParams = route.props.params || {}
  const initialRouteQuery = route.props.component.getQueries({ params: initialRouteParams })
  const query = findPaginatedQuery(initialRouteQuery)
  if(!query) {
    return route.props.pattern
  }
  return resolveNextURLsInPagination(route.props.pattern, query, fetch)
}

const flatten = array => {
  const flattenedArray = []
  array.forEach(item => {
    if(Array.isArray(item)) {
      flattenedArray.push(...flatten(item))
    } else {
      flattenedArray.push(item)
    }
  })
  return flattenedArray
}

const normalizePath = path => path.replace(/^\//, "")

const resolveURLsToPrerender = async function (routes, fetch) {
  const dynamicRoutes = await Promise.all(routes.map(route => resolveURLsForDynamicParams(fetch, route)))
  const paginatedURLs = await Promise.all(flatten(dynamicRoutes).map(route => resolvePaginatedURLs(fetch, route)))
  return flatten(paginatedURLs).map(normalizePath)
}

module.exports = resolveURLsToPrerender
