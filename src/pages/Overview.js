import Client from '../Client.js'
import JobSelector from '../components/JobSelector.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'
import PipelineSelector from '../components/PipelineSelector.js'

export default Vue.component('overview-page', {
  components: {
    JobSelector,
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
      <h1>Job</h1>
      <job-selector v-bind:client="client"></job-selector>
    </PageBase>
  `
})
