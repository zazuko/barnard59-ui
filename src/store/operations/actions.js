import { FETCH_OPERATIONS } from './action-types'
import { SET_OPERATIONS } from './mutation-types'
import NtriplesSerializer from '@rdfjs/serializer-ntriples'
import rdf from 'rdf-ext'
import { promises as jsonld } from 'jsonld'

const ntriplesSerializer = new NtriplesSerializer()

const frame = {
  '@context': {
    '@vocab': 'https://pipeline.described.at/',
    code: 'https://code.described.at/',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    label: 'rdfs:label',
    comment: 'rdfs:comment'
  },
  '@type': 'Operation'
}

export default {
  async [FETCH_OPERATIONS] ({ commit, rootGetters }, query = '') {
    let cf = await rootGetters.client.fetchOperations(query)
    const stream = ntriplesSerializer.import(cf.dataset.toStream())
    let triples = ''
    stream.on('data', (data) => {
      triples += data.toString()
    })

    await rdf.waitFor(stream)
    const operations = await jsonld.frame(await jsonld.fromRDF(triples), frame)

    commit(SET_OPERATIONS, operations['@graph'])
  }
}
