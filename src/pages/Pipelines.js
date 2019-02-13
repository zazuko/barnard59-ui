import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'
import PipelineSelector from '../components/PipelineSelector.vue'
import store from '../store'

export default Vue.component('pipelines-page', {
  components: {
    Navigation,
    PipelineSelector
  },
  store,
  template: `
    <PageBase>
      <navigation></navigation>
      <h1>Pipeline</h1>
      <pipeline-selector></pipeline-selector>
    </PageBase>
  `
})
