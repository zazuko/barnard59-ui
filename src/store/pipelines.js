import ns from '../utils/namespaces'

export default {
  state: {
    items: new Map()
  },
  mutations: {
    pipelinesFetched: function (state, pipelines) {
      state.items = pipelines
    }
  },
  actions: {
    async fetchPipelines ({ commit, rootState }) {
      const resource = await rootState.client.fetchPipelines()

      const pipelines = resource.out(ns.schema('hasPart')).toArray().reduce((pipelines, pipeline) => {
        return pipelines.set(pipeline.value, pipeline)
      }, new Map())

      commit('pipelinesFetched', pipelines)
    }
  }
}
