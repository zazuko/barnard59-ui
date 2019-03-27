export default {
  steps: (state) => {
    if (state.instance && state.instance.steps) {
      return state.instance.steps.stepList
    }

    return []
  },
  variables (state) {
    if (state.instance && state.instance.variables) {
      return state.instance.variables
        .map(v => v.variable)
        .filter(v => !Array.isArray(v))
        .filter(v => v === Object(v))
    }

    return []
  },
  pipelines (state, getters, rootState, rootGetters) {
    return rootGetters.resources.filter(r => r['@type'] === 'Pipeline')
  }
}
