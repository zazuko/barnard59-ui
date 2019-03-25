import { assert } from 'chai'
import { SAVE_RESOURCE, ADD_RESOURCE } from '../../src/store/root/action-types'
import rdf from 'rdf-ext'
import * as sinon from 'sinon'
import Client from '../../src/Client'
import actions from '../../src/store/root/actions'
import * as mutations from '../../src/store/root/mutation-types'

describe('root store', () => {
  describe('action', () => {
    describe(SAVE_RESOURCE, () => {
      it('performs server request', async () => {
        // given
        const dispatch = sinon.spy()
        const client = sinon.mock(new Client())
        const state = {
          client: client.object
        }
        const getters = {
          resourceIri: () => 'urn:test:pipeline',
          getDataset: () => rdf.dataset()
        }
        client.expects('update').once()

        // when
        await actions[SAVE_RESOURCE]({ state, dispatch, getters })

        // then
        client.verify()
      })
    })

    describe(ADD_RESOURCE, () => {
      it('commits new resource to state', () => {
        // given
        const resource = {}
        const commit = sinon.spy()

        // when
        actions[ADD_RESOURCE]({ commit }, resource)

        // then
        assert(commit.calledWith(
          mutations.RESOURCE_ADDED,
          resource
        ))
      })
    })
  })
})
