import rdf from 'rdf-ext'
import { promises as jsonld } from 'jsonld'
import clownface from 'clownface'
import NtriplesSerializer from '@rdfjs/serializer-ntriples'
import * as mutations from './mutation-types'
import * as actions from './action-types'

const ntriplesSerializer = new NtriplesSerializer()

export default {
  async [actions.LOAD_RESOURCE] ({ commit, getters }, { iri, frame, forceServer }) {
    let graphJson = getters.localStorage.load(iri)

    if (!graphJson || forceServer) {
      let cf = await getters.client.fetch(getters.resourceIri())
      const stream = ntriplesSerializer.import(cf.dataset.toStream())

      let triples = ''
      stream.on('data', (data) => {
        triples += data.toString()
      })

      await rdf.waitFor(stream)
      graphJson = await jsonld.frame(await jsonld.fromRDF(triples), frame)
      getters.localStorage.save(iri, graphJson)
    }

    commit(mutations.RESOURCE_LOADED, graphJson)
  },
  async [actions.PUBLISH_RESOURCE] ({ getters, state, commit }) {
    let id

    if (state.resourceGraph['@context']['@base'] === '') {
      id = (await getters.client.createPipeline()).value
      commit(mutations.BASE_SET, id)
    } else {
      id = getters.resourceIri()
    }

    const graph = await getters.serializedGraph()

    await getters.client.update(clownface(graph).node(id))
  },
  async [actions.SAVE_RESOURCE] ({ getters, state }, iri) {
    await getters.localStorage.save(iri, state.resourceGraph)
  },
  [actions.ADD_RESOURCE] ({ commit }, resource) {
    commit(mutations.RESOURCE_ADDED, resource)
  },
  async [actions.SAVE_SETTINGS] ({ commit }, settings) {
    commit(mutations.SETTINGS, settings)
  }
}
