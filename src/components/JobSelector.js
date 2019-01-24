import ns from '../utils/namespaces.js'
import Vue from 'vue/dist/vue.js'
import navigateTo from 'ld-navigation/fireNavigation'

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

      navigateTo(jobIri.value)
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
