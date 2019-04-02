import { RESOURCE_LOADED, RESOURCE_ADDED, SETTINGS, BASE_SET, RESOURCE_TYPE_ADDED } from './mutation-types'
import LdNavigator from 'ld-navigation/LdNavigator'

export default {
  [RESOURCE_LOADED] (state, graphJson) {
    state.resourceGraph = graphJson
  },
  [RESOURCE_ADDED] (state, resource) {
    state.resourceGraph['@graph'].push(resource)
  },
  [SETTINGS] (state, { baseUrl }) {
    localStorage.setItem('baseUrl', baseUrl)

    state.config.baseUrl = LdNavigator.base = baseUrl
  },
  [BASE_SET] (state, resourceBase) {
    state.resourceGraph['@context']['@base'] = resourceBase
  },
  [RESOURCE_TYPE_ADDED] (state, id, type) {
    const resource = state.resourceGraph['@graph'].find(r => r.id === id)

    if (Array.isArray(resource['@type']) === false) {
      resource['@type'] = [ resource['@type'] ]
    }

    resource['@type'].push(type)
  }
}
