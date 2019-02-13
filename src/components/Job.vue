<script>
import ns from '../utils/namespaces'
import Graph from './Graph.js'

export default {
  props: [
    'client',
    'jobIri'
  ],
  components: {
    Graph
  },
  data () {
    return {
      job: null
    }
  },
  created () {
    this.update()
  },
  watch: {
    jobIri () {
      this.update()
    }
  },
  methods: {
    update () {
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
    run () {
      this.job.addOut(ns.code('status'), ns.code('Started'))

      this.client.update(this.job)
    }
  }
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-lg-3">
        <!-- steps v-bind:base-url="baseUrl" v-bind:pipeline="pipeline" v-model="step"></steps -->
        <button class="btn btn-primary" @click="run">run</button>
      </div>
      <div class="col-lg-9">
        <!-- step v-bind:pipeline="pipeline" v-bind:step="step"></step -->
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <graph :graph="job"></graph>
      </div>
    </div>
  </div>
</template>
