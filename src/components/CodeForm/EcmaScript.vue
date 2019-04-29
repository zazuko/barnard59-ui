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
      this.implementation['code:link'] = operation['code:implementedBy']['code:link']
      this.$refs.search.inputValue = ''
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
  <div>
    <vue-bootstrap-typeahead
      ref="search"
      :data="operations"
      v-model="operationSearch"
      :serializer="op => op.label"
      placeholder="Type to find operation"
      @hit="setLink"></vue-bootstrap-typeahead>
    <div v-if="implementation['code:link']">
      Selected: <pre style="font-weight: bold">{{ implementation['code:link']['@id'] }}</pre>
    </div>
  </div>
</template>
