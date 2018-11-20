import rdf from 'rdf-ext'
import Client from '../Client.js'
import Job from '../components/Job.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'

export default Vue.component('job-page', {
  components: {
    Job,
    Navigation
  },
  data: function () {
    return {
      client: new Client(`${document.location.origin}/`),
      jobIri: rdf.namedNode(document.location.href)
    }
  },
  template: `
    <div>
      <navigation v-bind:job-iri="jobIri"></navigation>
      <job v-bind:client="client" v-bind:job-iri="jobIri"></job>
    </div>
  `
})
