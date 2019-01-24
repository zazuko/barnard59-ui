import Client from '../Client.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'
import Pipeline from '../components/Pipeline.js'
import PageBase from './PageBase'

export default Vue.component('pipeline-page', {
  components: {
    Navigation,
    Pipeline,
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
        <navigation v-bind:pipeline-iri="slotProps.resourceIri"></navigation>
        <pipeline v-bind:client="client" v-bind:pipeline-iri="slotProps.resourceIri"></pipeline>
      </template>
    </PageBase>
  `
})
