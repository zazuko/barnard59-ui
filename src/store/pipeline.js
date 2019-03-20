import mutations from './pipeline/mutations'
import actions from './pipeline/actions'

export default {
  namespaced: true,
  state: {
    iri: '',
    selectedStep: null,
    instance: {}
  },
  getters: {
    baseUrl: (state) => {
      if (state.iri.indexOf('#') !== -1) {
        return `${state.iri.split('#')[0]}#`
      } else {
        return state.iri.split('/').slice(0, -1).join('/')
      }
    },
    steps: (state) => {
      if (state.instance.steps) {
        return state.instance.steps.stepList
      }

      return []
    },
    variables: (state) => {
      if (state.instance.variables) {
        return state.instance.variables
          .map(v => v.variable)
          .filter(v => !Array.isArray(v))
          .filter(v => v === Object(v))
      }

      return []
    }
  },
  mutations,
  actions
}
