import rdf from 'rdf-ext'
import Graph from './Graph.js'
import Step from './Step.js'
import Steps from './Steps.js'
import Vue from 'vue/dist/vue.js'
import ns from '../utils/namespaces.js'
import { promises as jsonld } from 'jsonld'
import NtriplesSerializer from '@rdfjs/serializer-ntriples'
import Button from 'bootstrap-vue/es/components/button/button'

const ntriplesSerializer = new NtriplesSerializer()

const frame = {
  '@context': {
    'id': '@id',
    '@vocab': ns.p('').value,
    'code': ns.code('').value,
    'code:arguments': {
      '@container': '@list'
    },
    'stepList': {
      '@container': '@list'
    },
    'code:link': {
      '@type': '@id'
    }
  },
  '@type': 'https://pipeline.described.at/Pipeline'
}

export default Vue.component('pipeline', {
  props: [
    'client',
    'pipelineIri'
  ],
  components: {
    Graph,
    Step,
    Steps,
    'b-button': Button
  },
  data: function () {
    return {
      baseUrl: null,
      pipeline: null,
      step: null,
      pipelineGraph: null,
      context: frame['@context']
    }
  },
  created: function () {
    this.update()
  },
  watch: {
    pipelineIri: function () {
      this.update()
    },
    steps: {
      handler: function () {
        this.$refs.graph.update()
      },
      deep: true
    }
  },
  methods: {
    update: async function () {
      if (!this.pipelineIri) {
        this.pipeline = null

        return
      }

      if (this.pipelineIri.indexOf('#') !== -1) {
        this.baseUrl = `${this.pipelineIri.split('#')[0]}#`
      } else {
        this.baseUrl = this.pipelineIri.split('/').slice(0, -1).join('/')
      }

      let cf = await this.client.fetch(this.pipelineIri)
      const stream = ntriplesSerializer.import(cf.dataset.toStream())

      let triples = ''
      stream.on('data', (data) => {
        triples += data.toString()
      })

      await rdf.waitFor(stream)
      const pipelineJson = await jsonld.frame(await jsonld.fromRDF(triples), frame)

      this.pipeline = pipelineJson['@graph'].find(res => res.id === this.pipelineIri)
    },
    saveClicked: function () {
      this.client.update(this.pipeline)
    },
    addStep: function (index) {
      const step = {
        id: `${this.baseUrl}${index}`
      }

      this.steps.splice(index, 0, step)
    },
    deleteStep: function (index) {
      this.steps.splice(index, 1)
    }
  },
  computed: {
    steps: function () {
      if (!this.pipeline) {
        return []
      }

      return this.pipeline.steps.stepList
    }
  },
  template: `
    <div>
      <div class="row">
        <div class="col-lg-3">
          <steps v-bind:base-url="baseUrl"
                 v-bind:steps="steps"
                 v-on:step-added="addStep"
                 v-on:step-deleted="deleteStep"
                 v-model="step"></steps>
          <b-button variant="primary" v-on:click="saveClicked">save</b-button>
        </div>
        <div class="col-lg-9">
          <step v-bind:pipeline="pipeline" v-bind:step="step"></step>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <graph ref="graph" v-bind:json-ld="pipeline" v-bind:context="context" syntax="json-ld"></graph>
        </div>
      </div>
    </div>
  `
})
