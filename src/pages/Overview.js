import store from '../store'
import JobSelector from '../components/JobSelector.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.vue'
import PipelineSelector from '../components/PipelineSelector.vue'

export default Vue.component('overview-page', {
  components: {
    JobSelector,
    Navigation,
    PipelineSelector
  },
  store,
  template: `
    <PageBase>
      <navigation></navigation>
      <h1>Pipeline</h1>
      <pipeline-selector></pipeline-selector>
      <h1>Job</h1>
      <job-selector></job-selector>
    </PageBase>
  `
})
