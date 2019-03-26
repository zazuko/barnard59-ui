import { RESOURCE_LOADED, RESOURCE_ADDED, SETTINGS } from './mutation-types'
import LdNavigator from 'ld-navigation/LdNavigator'

export default {
  [RESOURCE_LOADED] (state, graphJson) {
    state.resourceGraph = graphJson
  },
  [RESOURCE_ADDED] (state, resource) {
    state.resourceGraph['@graph'].push(resource)
  },
  [SETTINGS] (state, { baseUrl, useLocalStorage }) {
    localStorage.setItem('baseUrl', baseUrl)
    localStorage.setItem('useLocalStorage', useLocalStorage)

    state.config.baseUrl = LdNavigator.base = baseUrl
    state.config.useLocalStorage = useLocalStorage
  }
}
