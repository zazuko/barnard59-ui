import JobSelector from '../components/JobSelector.vue'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.vue'
import PageBase from './PageBase'

export default Vue.component('jobs-page', {
  components: {
    JobSelector,
    Navigation,
    PageBase
  },
  template: `
    <PageBase>
      <navigation></navigation>
      <h1>Job</h1>
      <job-selector></job-selector>
    </PageBase>
  `
})
