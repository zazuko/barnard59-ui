import Vuex from 'vuex'
import Vue from 'vue/dist/vue.js'
import Client from '../Client'
import LdNavigator from 'ld-navigation/LdNavigator'
import pipelines from './pipelines'
import jobs from './jobs'
import pipeline, { frame } from './pipeline'
import rdf from 'rdf-ext'
import { promises as jsonld } from 'jsonld'
import NtriplesSerializer from '@rdfjs/serializer-ntriples'
import clownface from 'clownface'
import Readable from 'readable-stream'
import JsonldParser from '@rdfjs/parser-jsonld'

Vue.use(Vuex)

const client = new Client()
const ntriplesSerializer = new NtriplesSerializer()
const jsonldParser = new JsonldParser()

export default new Vuex.Store({
  strict: true,
  state: {
    resourceIri: LdNavigator.resourceUrl,
    client,
    resourceGraph: null
  },
  modules: {
    jobs,
    pipelines,
    pipeline
  },
  mutations: {
    graph_loaded (state, graphJson) {
      state.resourceGraph = graphJson
    }
  },
  actions: {
    async loadResource ({ state, commit }) {
      let cf = await state.client.fetch(LdNavigator.resourceUrl)
      const stream = ntriplesSerializer.import(cf.dataset.toStream())

      let triples = ''
      stream.on('data', (data) => {
        triples += data.toString()
      })

      await rdf.waitFor(stream)
      const graphJson = await jsonld.frame(await jsonld.fromRDF(triples), frame)

      commit('graph_loaded', graphJson)
    },
    async saveResource ({ state }) {
      const input = new Readable({
        read: () => {
          input.push(JSON.stringify(state.resourceGraph))
          input.push(null)
        }
      })

      const graph = rdf.dataset()
      const jsonldStream = jsonldParser.import(input)

      jsonldStream.on('data', (quad) => {
        graph.add(quad)
      })

      await rdf.waitFor(jsonldStream)
      const iri = LdNavigator.resourceUrl
      await state.client.update(clownface(graph).node(iri))
    }
  },
  getters: {
    resources (state) {
      if (!state.resourceGraph) {
        return []
      }

      return state.resourceGraph['@graph'] || []
    }
  }
})
