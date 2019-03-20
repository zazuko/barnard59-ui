import { RESOURCE_LOADED } from './mutation-types'

export default {
  [RESOURCE_LOADED] (state, graphJson) {
    state.resourceGraph = graphJson
  }
}
