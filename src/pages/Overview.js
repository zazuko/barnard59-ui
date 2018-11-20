import url from 'url'
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
      client: new Client(`${document.location.origin}/`),
      jobIri: null,
      pipelineIri: null
    }
  },
  watch: {
    jobIri: function () {
      const parts = url.parse(this.jobIri.value)

      return this.$router.push([parts.path, parts.hash].join(''))
    },
    pipelineIri: function () {
      const parts = url.parse(this.pipelineIri.value)

      return this.$router.push([parts.path, parts.hash].join(''))
    }
  },
  template: `
    <div>
      <navigation></navigation>
      <h1>Pipeline</h1>
      <pipeline-selector v-bind:client="client" v-model="pipelineIri"></pipeline-selector>
      <h1>Job</h1>
      <job-selector v-bind:client="client" v-model="jobIri"></job-selector>
    </div>
  `
})
