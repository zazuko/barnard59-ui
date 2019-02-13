import ns from '../utils/namespaces'

export default {
  state: {
    items: new Map()
  },
  mutations: {
    jobsFetched: function (state, jobs) {
      state.items = jobs
    }
  },
  actions: {
    async fetchJobs ({ commit, rootState }) {
      const resource = await rootState.client.fetchJobs()

      const jobs = resource.out(ns.schema('hasPart')).toArray().reduce((jobs, job) => {
        return jobs.set(job.value, job)
      }, new Map())

      commit('jobsFetched', jobs)
    }
  }
}
