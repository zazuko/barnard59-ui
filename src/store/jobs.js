import ns from '../utils/namespaces'

export default {
  state: {
    items: new Map()
  },
  mutations: {
    jobsFetched (state, jobs) {
      state.items = jobs
    }
  },
  actions: {
    async fetchJobs ({ commit, rootGetters }) {
      const resource = await rootGetters.client.fetchJobs()

      const jobs = resource.out(ns.schema('hasPart')).toArray().reduce((jobs, job) => {
        return jobs.set(job.value, job)
      }, new Map())

      commit('jobsFetched', jobs)
    }
  }
}
