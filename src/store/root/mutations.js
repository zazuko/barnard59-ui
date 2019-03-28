import { RESOURCE_LOADED, RESOURCE_ADDED, SETTINGS, BASE_SET } from './mutation-types'
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
  }
}
