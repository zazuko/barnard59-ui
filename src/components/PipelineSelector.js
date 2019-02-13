import Vue from 'vue/dist/vue.js'
import navigateTo from 'ld-navigation/fireNavigation'
import { mapState } from 'vuex'

export default Vue.component('pipeline-selector', {
  data: function () {
    return {
      selected: null
    }
  },
  computed: mapState({
    pipelines: state => state.pipelines.items
  }),
  created: function () {
    this.$store.dispatch('fetchPipelines')
  },
  watch: {
    selected: function () {
      const pipelineIri = this.pipelines.get(this.selected).term

      navigateTo(pipelineIri.value)
    }
  },
  template: `
    <select class="form-control" v-model="selected">
      <option v-for="pipeline in [...pipelines.values()]" v-bind:value="pipeline.value">
        {{ pipeline.value }}
      </option>
    </select>
  `
})
