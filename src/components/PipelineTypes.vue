<script>
import { createNamespacedHelpers } from 'vuex'
import { addPipelineType, removePipelineType } from '../store/pipeline/action-types'
import BFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'

const { mapActions, mapState } = createNamespacedHelpers('pipeline')

const pipelineTypes = [
  'Readable',
  'ReadableObjectMode',
  'Writable',
  'WritableObjectMode'
]

export default {
  components: { BFormCheckbox },
  data () {
    return { pipelineTypes }
  },
  methods: {
    ...mapActions({
      addType: addPipelineType,
      removeType: removePipelineType
    }),
    isTypedAs (type) {
      return this.types.includes(type)
    },
    toggleType (type) {
      if (this.isTypedAs(type)) {
        this.removeType(type)
      } else {
        this.addType(type)
      }
    }
  },
  computed: {
    ...mapState({
      pipeline: 'instance'
    }),
    types () {
      return Array.isArray(this.pipeline['@type']) ? this.pipeline['@type'] : [ this.pipeline['@type'] ]
    }
  }
}
</script>

<template>
  <div v-if="pipeline">
    <b-form-checkbox
      v-for="type of pipelineTypes"
      :key="type"
      :checked="isTypedAs(type)"
      @change="toggleType(type)">{{ type }}</b-form-checkbox>
  </div>
</template>
