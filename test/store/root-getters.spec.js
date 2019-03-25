import getters from '../../src/store/root/getters'
import { expect } from 'chai'
import * as sinon from 'sinon'
import rdf from 'rdf-ext'
import cf from 'clownface'

describe('root getter', () => {
  describe('datasetContains', () => {
    let serializedGraph

    beforeEach(() => {
      serializedGraph = sinon.stub(getters, 'serializedGraph')
    })

    it('returns false when subject does not exist', async () => {
      // given
      serializedGraph.callsFake(() => rdf.dataset())

      // when
      const result = await getters.datasetContains(null, getters)('urn:test:node')

      // then
      expect(result).to.equal(false)
    })

    it('returns true when subject does exist', async () => {
      // given
      serializedGraph.callsFake(() => {
        const ds = rdf.dataset()
        cf(ds).node(rdf.namedNode('urn:test:node'))
          .addOut(
            rdf.namedNode('https://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            rdf.namedNode('https://pipeline.described.at/Pipeline'))
        return ds
      })

      // when
      const result = await getters.datasetContains(null, getters)('urn:test:node')

      // then
      expect(result).to.equal(true)
    })

    afterEach(() => {
      getters.serializedGraph.restore()
    })
  })
})
