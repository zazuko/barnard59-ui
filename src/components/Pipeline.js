import rdf from 'rdf-ext'
import Graph from './Graph.js'
import Step from './Step.js'
import Steps from './Steps.js'
import Vue from 'vue/dist/vue.js'

export default Vue.component('pipeline', {
  props: [
    'client',
    'pipelineIri'
  ],
  components: {
    Graph,
    Step,
    Steps
  },
  data: function () {
    return {
      baseUrl: null,
      pipeline: null,
      step: null
    }
  },
  created: function () {
    this.update()
  },
  watch: {
    pipelineIri: function () {
      this.update()
    }
  },
  methods: {
    update: function () {
      if (!this.pipelineIri) {
        this.pipeline = null

        return
      }

      if (this.pipelineIri.indexOf('#') !== -1) {
        this.baseUrl = `${this.pipelineIri.split('#')[0]}#`
      } else {
        this.baseUrl = this.pipelineIri.split('/').slice(0, -1).join('/')
      }

      this.client.fetch(this.pipelineIri).then(pipeline => {
        pipeline = pipeline.node(rdf.namedNode(this.pipelineIri))

        if (!pipeline.term) {
          pipeline = null
        }

        this.pipeline = pipeline
      })
    },
    saveClicked: function () {
      this.client.update(this.pipeline)
    }
  },
  template: `
    <div>
      <div class="row">
        <div class="col-lg-3">
          <steps v-bind:base-url="baseUrl" v-bind:pipeline="pipeline" v-model="step"></steps>
          <button class="btn btn-primary" v-on:click="saveClicked">save</button>
        </div>
        <div class="col-lg-9">
          <step v-bind:pipeline="pipeline" v-bind:step="step"></step>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <graph v-bind:graph="pipeline && pipeline._context[0].dataset"></graph>
        </div>
      </div>
    </div>
  `
})
