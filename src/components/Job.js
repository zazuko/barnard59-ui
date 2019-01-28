import ns from '../utils/namespaces'
import Graph from './Graph.js'
import Vue from 'vue/dist/vue.js'

export default Vue.component('job', {
  props: [
    'client',
    'jobIri'
  ],
  components: {
    Graph
  },
  data: function () {
    return {
      job: null
    }
  },
  created: function () {
    this.update()
  },
  watch: {
    jobIri: function () {
      this.update()
    }
  },
  methods: {
    update: function () {
      if (!this.jobIri) {
        this.job = null

        return
      }

      this.client.fetch(this.jobIri).then(job => {
        job = job.node().has(ns.rdf('type', ns.p('Job')))

        if (!job.term) {
          job = null
        }

        this.job = job
      })
    },
    run: function () {
      this.job.addOut(ns.code('status'), ns.code('Started'))

      this.client.update(this.job)
    }
  },
  template: `
    <div>
      <div class="row">
        <div class="col-lg-3">
          <!-- steps v-bind:base-url="baseUrl" v-bind:pipeline="pipeline" v-model="step"></steps -->
          <button class="btn btn-primary" v-on:click="run">run</button>
        </div>
        <div class="col-lg-9">
          <!-- step v-bind:pipeline="pipeline" v-bind:step="step"></step -->
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <graph v-bind:dataset="job && job._context[0].dataset"></graph>
        </div>
      </div>
    </div>
  `
})
