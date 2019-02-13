import Vue from 'vue/dist/vue.js'
import Nav from 'bootstrap-vue/es/components/navbar/index'

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
      jobsBaseUrl: `/job/`,
      pipelinesBaseUrl: `/pipeline/`
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
        <router-link v-if="jobIri" class="nav-link" v-bind:to="{ path: jobIri }">
          {{ jobIri.slice(jobsBaseUrl.length) }}
        </router-link>
        <router-link v-if="pipelineIri" class="nav-link" v-bind:to="{ path: '/pipeline/' }">Pipelines</router-link>
        <router-link v-if="pipelineIri" class="nav-link" v-bind:to="{ path: pipelineIri }">
          {{ pipelineIri.slice(pipelinesBaseUrl.length) }}
        </router-link>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  `
})
