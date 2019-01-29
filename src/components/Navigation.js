import Vue from 'vue/dist/vue.js'
import Nav from 'bootstrap-vue/es/components/navbar/index'
import * as config from '../config'

Vue.use(Nav)

export default Vue.component('navigation', {
  props: [
    'jobIri',
    'pipelineIri'
  ],
  components: {
  },
  data: function () {
    return {
      jobsBaseUrl: `${config.baseUrl}/job/`,
      pipelinesBaseUrl: `${config.baseUrl}/pipeline/`
    }
  },
  methods: {
  },
  template: `
  <b-navbar toggleable="md">
  
    <b-navbar-brand href="/">Barnard 59</b-navbar-brand>
  
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <router-link class="nav-link" v-bind:to="{ path: '/' }">Start</router-link>
        <router-link v-if="jobIri" class="nav-link" v-bind:to="{ path: '/job/' }">Jobs</router-link>
        <b-nav-item v-if="jobIri" href="javascript:void()">
          {{ jobIri.slice(jobsBaseUrl.length) }}
        </b-nav-item>
        <router-link v-if="pipelineIri" class="nav-link" v-bind:to="{ path: '/pipeline/' }">Pipelines</router-link>
        <b-nav-item v-if="pipelineIri" href="javascript:void()">
          {{ pipelineIri.slice(pipelinesBaseUrl.length) }}
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  `
})
