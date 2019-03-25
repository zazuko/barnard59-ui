import rdf from 'rdf-ext'
import { promises as jsonld } from 'jsonld'
import clownface from 'clownface'
import NtriplesSerializer from '@rdfjs/serializer-ntriples'
import * as mutations from './mutation-types'
import * as actions from './action-types'

const ntriplesSerializer = new NtriplesSerializer()

export default {
  async [actions.LOAD_RESOURCE] ({ state, commit, getters }, frame) {
    let cf = await state.client.fetch(getters.resourceIri())
    const stream = ntriplesSerializer.import(cf.dataset.toStream())

    let triples = ''
    stream.on('data', (data) => {
      triples += data.toString()
    })

    await rdf.waitFor(stream)
    const graphJson = await jsonld.frame(await jsonld.fromRDF(triples), frame)

    commit(mutations.RESOURCE_LOADED, graphJson)
  },
  async [actions.SAVE_RESOURCE] ({ state, getters }) {
    const graph = await getters.serializedGraph()
    await state.client.update(clownface(graph).node(getters.resourceIri()))
  },
  [actions.ADD_RESOURCE] ({ commit }, resource) {
    commit(mutations.RESOURCE_ADDED, resource)
  }
}
