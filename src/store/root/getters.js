import LdNavigator from 'ld-navigation/LdNavigator'

export default {
  resources (state) {
    if (!state.resourceGraph) {
      return []
    }

    return state.resourceGraph['@graph'] || []
  },
  resourceIri () {
    return () => LdNavigator.resourceUrl
  }
}
