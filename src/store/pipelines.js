import ns from '../utils/namespaces'

export default {
  state: {
    items: new Map()
  },
  mutations: {
    pipelinesFetched (state, pipelines) {
      state.items = pipelines
    }
  },
  actions: {
    async fetchPipelines ({ commit, rootGetters }) {
      const resource = await rootGetters.client.fetchPipelines()

      const pipelines = resource.out(ns.schema('hasPart')).toArray().reduce((pipelines, pipeline) => {
        return pipelines.set(pipeline.value, pipeline)
      }, new Map())

      commit('pipelinesFetched', pipelines)
    }
  }
}
