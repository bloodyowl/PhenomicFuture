const createStore = (initialState) => {
  let state = initialState || {}
  const subscribers = new Set()
  const store = {
    subscribe(func) {
      subscribers.add(func)
      return () => {
        subscribers.delete(func)
      }
    },
    get: (key) => {
      return state[key] || { status: "inactive", value: null }
    },
    set: (key, value) => {
      store.update(Object.assign(
         {},
         state,
         { [key]: { status: "idle", value } }
       ))
    },
    setAsLoading: (key, value) => {
      store.update(Object.assign(
       {},
       state,
       { [key]: { status: "loading", value: null } }
     ))
    },
    update(nextState) {
      state = nextState
      subscribers.forEach(func => func())
    },
    getState() {
      return state
    }
  }
  return store
}

module.exports = createStore
