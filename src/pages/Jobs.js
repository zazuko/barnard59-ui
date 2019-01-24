import Client from '../Client.js'
import JobSelector from '../components/JobSelector.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'
import PageBase from './PageBase'

export default Vue.component('jobs-page', {
  components: {
    JobSelector,
    Navigation,
    PageBase
  },
  data: function () {
    return {
      client: new Client()
    }
  },
  template: `
    <PageBase>
      <navigation></navigation>
      <h1>Job</h1>
      <job-selector v-bind:client="client"></job-selector>
    </PageBase>
  `
})
