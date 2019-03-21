export default {
  baseUrl (state) {
    const whereIsHash = state.iri.indexOf('#')
    if (whereIsHash >= 0) {
      return state.iri.slice(0, whereIsHash + 1)
    } else {
      return `${state.iri}#`
    }
  },
  steps: (state) => {
    if (state.instance.steps) {
      return state.instance.steps.stepList
    }

    return []
  },
  variables (state) {
    if (state.instance.variables) {
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
