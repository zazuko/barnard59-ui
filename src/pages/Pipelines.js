import Client from '../Client.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'
import PipelineSelector from '../components/PipelineSelector.js'

export default Vue.component('pipelines-page', {
  components: {
    Navigation,
    PipelineSelector
  },
  data: function () {
    return {
      client: new Client()
    }
  },
  template: `
    <PageBase>
      <navigation></navigation>
      <h1>Pipeline</h1>
      <pipeline-selector v-bind:client="client"></pipeline-selector>
    </PageBase>
  `
})
