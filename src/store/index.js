import Vuex from 'vuex'
import Vue from 'vue/dist/vue.js'
import Client from '../Client'
import LdNavigator from 'ld-navigation/LdNavigator'
import pipelines from './pipelines'
import jobs from './jobs'
import pipeline from './pipeline'

Vue.use(Vuex)

const client = new Client()

export default new Vuex.Store({
  strict: true,
  state: {
    resourceIri: LdNavigator.resourceUrl,
    client
  },
  modules: {
    jobs,
    pipelines,
    pipeline
  }
})
