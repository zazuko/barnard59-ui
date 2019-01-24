import Client from '../Client.js'
import Job from '../components/Job.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'
import PageBase from './PageBase'

export default Vue.component('job-page', {
  components: {
    Job,
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
      <template slot-scope="slotProps">
        <navigation v-bind:job-iri="slotProps.resourceIri"></navigation>
        <job v-bind:client="client" v-bind:job-iri="slotProps.resourceIri"></job>
      </template>
    </PageBase>
  `
})
