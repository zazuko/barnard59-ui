import { RESOURCE_LOADED, RESOURCE_ADDED } from './mutation-types'

export default {
  [RESOURCE_LOADED] (state, graphJson) {
    state.resourceGraph = graphJson
  },
  [RESOURCE_ADDED] (state, resource) {
    state.resourceGraph['@graph'].push(resource)
  }
}
