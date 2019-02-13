import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.vue'
import Pipeline from '../components/Pipeline.js'
import PageBase from './PageBase'
import store from '../store'

export default Vue.component('pipeline-page', {
  components: {
    Navigation,
    Pipeline,
    PageBase
  },
  store,
  template: `
    <PageBase>
      <template slot-scope="slotProps">
        <navigation :pipeline-iri="$store.state.resourceIri"></navigation>
        <pipeline></pipeline>
      </template>
    </PageBase>
  `
})
