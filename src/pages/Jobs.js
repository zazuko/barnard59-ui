import url from 'url'
import Client from '../Client.js'
import JobSelector from '../components/JobSelector.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'

export default Vue.component('jobs-page', {
  components: {
    JobSelector,
    Navigation
  },
  data: function () {
    return {
      client: new Client(`${document.location.origin}/`),
      jobIri: null
    }
  },
  watch: {
    jobIri: function () {
      const parts = url.parse(this.jobIri.value)

      return this.$router.push([parts.path, parts.hash].join(''))
    }
  },
  template: `
    <div>
      <navigation></navigation>
      <h1>Job</h1>
      <job-selector v-bind:client="client" v-model="jobIri"></job-selector>
    </div>
  `
})
