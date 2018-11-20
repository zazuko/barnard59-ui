import ns from '../utils/namespaces.js'
import Vue from 'vue/dist/vue.js'

export default Vue.component('job-selector', {
  props: [
    'client'
  ],
  components: {
  },
  data: function () {
    return {
      selected: null,
      jobs: new Map()
    }
  },
  created: function () {
    this.client.fetchJobs().then(jobs => {
      this.jobs = jobs.out(ns.schema('hasPart')).toArray().reduce((jobs, job) => {
        return jobs.set(job.value, job)
      }, new Map())
    }).catch(err => console.error(err))
  },
  watch: {
    selected: function () {
      const jobIri = this.jobs.get(this.selected).term

      this.$emit('input', jobIri)
    }
  },
  template: `
    <select class="form-control" v-model="selected">
      <option v-for="job in [...jobs.values()]" v-bind:value="job.value">
        {{ job.value }}
      </option>
    </select>
  `
})
