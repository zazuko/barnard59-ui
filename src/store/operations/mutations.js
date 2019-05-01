import { SET_OPERATIONS } from './mutation-types'

export default {
  [SET_OPERATIONS] (state, operations) {
    state.operations = operations
  }
}
