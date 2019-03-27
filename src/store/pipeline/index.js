import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default {
  namespaced: true,
  state: {
    iri: '',
    baseIri: '',
    selectedStep: null,
    instance: null
  },
  getters,
  mutations,
  actions
}
