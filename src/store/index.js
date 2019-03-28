import Vuex from 'vuex'
import Vue from 'vue/dist/vue.js'
import Client from '../Client'
import LocalStorageClient from '../Client/local'
import pipelines from './pipelines'
import jobs from './jobs'
import pipeline from './pipeline/index'
import mutations from './root/mutations'
import actions from './root/actions'
import getters from './root/getters'
import config from '../config'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    config: {
      baseUrl: localStorage.getItem('baseUrl') || config.baseUrl
    },
    resourceGraph: null
  },
  modules: {
    jobs,
    pipelines,
    pipeline
  },
  mutations,
  actions,
  getters: {
    ...getters,
    localStorage (state) {
      return new LocalStorageClient(state.config.baseUrl)
    },
    client (state) {
      return new Client(state.config.baseUrl)
    }
  }
})
