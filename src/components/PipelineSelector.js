import ns from '../utils/namespaces.js'
import Vue from 'vue/dist/vue.js'
import navigateTo from 'ld-navigation/fireNavigation'

export default Vue.component('pipeline-selector', {
  props: [
    'client'
  ],
  components: {
  },
  data: function () {
    return {
      selected: null,
      pipelines: new Map()
    }
  },
  created: function () {
    this.client.fetchPipelines().then(pipelines => {
      this.pipelines = pipelines.out(ns.schema('hasPart')).toArray().reduce((pipelines, pipeline) => {
        return pipelines.set(pipeline.value, pipeline)
      }, new Map())
    }).catch(err => console.error(err))
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
