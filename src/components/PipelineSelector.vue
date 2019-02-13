<script>
import navigateTo from 'ld-navigation/fireNavigation'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selected: null
    }
  },
  computed: {
    ...mapState({
      pipelines: state => state.pipelines.items
    }),
    items () {
      return this.pipelines.values()
    }
  },
  created () {
    this.$store.dispatch('fetchPipelines')
  },
  watch: {
    selected () {
      const pipelineIri = this.pipelines.get(this.selected).term

      navigateTo(pipelineIri.value)
    }
  }
}
</script>

<template>
  <select class="form-control" v-model="selected">
    <option v-for="pipeline in items" :value="pipeline.value" :key="pipeline.value">
      {{ pipeline.value }}
    </option>
  </select>
</template>
