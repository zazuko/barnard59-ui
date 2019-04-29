<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import { createNamespacedHelpers } from 'vuex'
import { FETCH_OPERATIONS } from '../../store/operations/action-types'

const { mapState, mapActions } = createNamespacedHelpers('operations')

export default {
  name: 'ImplementedByEcmascript',
  components: {
    VueBootstrapTypeahead
  },
  props: [
    'implementation'
  ],
  computed: {
    ...mapState({
      operations: 'operations'
    })
  },
  data () {
    return {
      operationSearch: ''
    }
  },
  methods: {
    ...mapActions([
      FETCH_OPERATIONS
    ]),
    setLink (operation) {
      debugger
      this.implementation['code:link'] = operation['code:implementedBy']['code:link']
    }
  },
  watch: {
    operationSearch () {
      this[FETCH_OPERATIONS](this.operationSearch)
    }
  }
}
</script>

<template>
  <vue-bootstrap-typeahead
    :data="operations"
    v-model="operationSearch"
    :serializer="op => op.label"
    @hit="setLink"></vue-bootstrap-typeahead>
</template>
