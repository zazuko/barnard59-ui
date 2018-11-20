import rdf from 'rdf-ext'
import Client from '../Client.js'
import Vue from 'vue/dist/vue.js'
import Navigation from '../components/Navigation.js'
import Pipeline from '../components/Pipeline.js'

export default Vue.component('pipeline-page', {
  components: {
    Navigation,
    Pipeline
  },
  data: function () {
    return {
      client: new Client(`${document.location.origin}/`),
      pipelineIri: rdf.namedNode(document.location.href)
    }
  },
  template: `
    <div>
      <navigation v-bind:pipeline-iri="pipelineIri"></navigation>
      <pipeline v-bind:client="client" v-bind:pipeline-iri="pipelineIri"></pipeline>
    </div>
  `
})
