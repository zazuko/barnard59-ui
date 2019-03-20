import rdf from 'rdf-ext'
import { promises as jsonld } from 'jsonld'
import clownface from 'clownface'
import NtriplesSerializer from '@rdfjs/serializer-ntriples'
import JsonldParser from '@rdfjs/parser-jsonld'
import Readable from 'readable-stream'
import * as mutations from './mutation-types'
import * as actions from './action-types'

const ntriplesSerializer = new NtriplesSerializer()
const jsonldParser = new JsonldParser()

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
    await state.client.update(clownface(graph).node(getters.resourceIri()))
  }
}
