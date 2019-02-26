import { expect } from 'chai'
import { load } from '../../src/store/pipeline-action-types'
import * as mutations from '../../src/store/pipeline-mutation-types'
import actions from '../../src/store/pipeline-actions'
import * as sinon from 'sinon'
import Client from '../../src/Client'
import cf from 'clownface'
import rdf from 'rdf-ext'

describe('action', () => {
  describe(load, () => {
    it('commits iri to state', async () => {
      // given
      const client = sinon.mock(new Client())
      const commit = sinon.spy()
      const rootState = { client: client.object }
      const iri = 'urn:pipeline:1'
      client.expects('fetch').once().resolves(cf(rdf.dataset()))

      // when
      await actions.load({ commit, rootState }, iri)

      // then
      expect(commit.firstCall.args[0]).to.equal(mutations.IRI_SET)
    })
  })
})
