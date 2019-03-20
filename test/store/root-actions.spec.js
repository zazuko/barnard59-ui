import { SAVE_RESOURCE } from '../../src/store/root/action-types'
import { code } from '../../src/utils/namespaces'
import * as sinon from 'sinon'
import Client from '../../src/Client'
import actions from '../../src/store/root/actions'

describe('root store', () => {
  describe('action', () => {
    describe(SAVE_RESOURCE, () => {
      it('saves the pipeline', async () => {
        // given
        const dispatch = sinon.spy()
        const client = sinon.mock(new Client())
        const state = {
          client: client.object,
          '@graph': {
            'urn:test:pipeline': {
              '@type': code.Pipeline
            }
          }
        }
        const getters = {
          resourceIri: () => 'urn:test:pipeline'
        }
        client.expects('update').once()

        // when
        await actions[SAVE_RESOURCE]({ state, dispatch, getters })

        // then
        client.verify()
      })
    })
  })
})
