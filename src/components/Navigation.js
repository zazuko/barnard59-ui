import Vue from 'vue/dist/vue.js'

export default Vue.component('navigation', {
  props: [
    'jobIri',
    'pipelineIri'
  ],
  components: {
  },
  data: function () {
    return {
      jobsBaseUrl: `${document.location.origin}/job/`,
      pipelinesBaseUrl: `${document.location.origin}/pipeline/`
    }
  },
  methods: {
  },
  template: `
    <ul class="nav">
      <li class="nav-item">
        <router-link class="nav-link" v-bind:to="{ path: '/' }">Start</router-link>
      </li>
      <li class="nav-item" v-if="jobIri">
        <router-link class="nav-link" v-bind:to="{ path: '/job/' }">Jobs</router-link>
      </li>
      <li class="nav-item" v-if="jobIri">
        <a class="nav-link" href="#">{{ (jobIri && jobIri.value).slice(jobsBaseUrl.length) }}</a>
      </li>
      <li class="nav-item" v-if="pipelineIri">
        <router-link class="nav-link" v-bind:to="{ path: '/pipeline/' }">Pipelines</router-link>
      </li>
      <li class="nav-item" v-if="pipelineIri">
        <a class="nav-link" href="#">{{ (pipelineIri && pipelineIri.value).slice(pipelinesBaseUrl.length) }}</a>
      </li>
    </ul>
  `
})
