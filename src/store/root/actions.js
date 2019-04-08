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
  [actions.SAVE_RESOURCE] ({ getters, state }, iri) {
    getters.localStorage.save(iri, state.resourceGraph)
  },
  [actions.ADD_RESOURCE] ({ commit }, resource) {
    commit(mutations.RESOURCE_ADDED, resource)
  },
  async [actions.SAVE_SETTINGS] ({ commit }, settings) {
    commit(mutations.SETTINGS, settings)
  },
  [actions.ADD_RESOURCE_TYPE] ({ commit, getters }, typeAdd) {
    const resource = getters.resources.find(res => res.id === typeAdd.id)

    if (!resource) {
      return
    }

    const typesArray = Array.isArray(resource['@type']) ? resource['@type'] : [ resource['@type'] ]

    if (typesArray.includes(typeAdd.type) === false) {
      commit(mutations.RESOURCE_TYPE_ADDED, { id: typeAdd.id, type: typeAdd.type })
    }
  },
  [actions.REMOVE_RESOURCE_TYPE] ({ commit, getters }, typeRemove) {
    const resource = getters.resources.find(res => res.id === typeRemove.id)

    if (!resource) {
      return
    }

    const typesArray = Array.isArray(resource['@type']) ? resource['@type'] : [ resource['@type'] ]

    if (typesArray.includes(typeRemove.type)) {
      commit(mutations.RESOURCE_TYPE_REMOVED, { id: typeRemove.id, type: typeRemove.type })
    }
  }
}
