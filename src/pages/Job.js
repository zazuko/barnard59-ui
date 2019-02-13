import Client from '../Client.js'
import Job from '../components/Job.vue'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.vue'
import PageBase from './PageBase'
import store from '../store'
import LdNavigator from 'ld-navigation/LdNavigator'

export default Vue.component('job-page', {
  store,
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
  computed: {
    resourceIri () {
      return LdNavigator.resourceUrl
    }
  },
  template: `
    <PageBase>
      <template slot-scope="slotProps">
        <navigation :job-iri="$store.state.resourceIri"></navigation>
        <job :client="client" :job-iri="resourceIri"></job>
      </template>
    </PageBase>
  `
})
