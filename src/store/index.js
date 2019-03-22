import Vuex from 'vuex'
import Vue from 'vue/dist/vue.js'
import Client from '../Client'
import pipelines from './pipelines'
import jobs from './jobs'
import pipeline from './pipeline/index'
import mutations from './root/mutations'
import actions from './root/actions'
import getters from './root/getters'

Vue.use(Vuex)

const client = new Client()

export default new Vuex.Store({
  strict: true,
  state: {
    client,
    resourceGraph: null
  },
  modules: {
    jobs,
    pipelines,
    pipeline
  },
  mutations,
  actions,
  getters
})
