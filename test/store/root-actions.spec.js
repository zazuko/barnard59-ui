import { assert } from 'chai'
import { SAVE_RESOURCE, ADD_RESOURCE, LOAD_RESOURCE, PUBLISH_RESOURCE, ADD_RESOURCE_TYPE} from '../../src/store/root/action-types'
import rdf from 'rdf-ext'
import * as sinon from 'sinon'
import cf from 'clownface'
import { promises as jsonld } from 'jsonld'
import Client from '../../src/Client'
import actions from '../../src/store/root/actions'
import * as mutations from '../../src/store/root/mutation-types'

describe('root store', () => {
  describe('action', () => {
    describe(SAVE_RESOURCE, () => {
      it('saves to local storage', () => {
        // given
        const iri = 'id'
        const state = {
          resourceGraph: {}
        }
        const getters = {
          localStorage: {
            save: sinon.spy()
          }
        }

        // when
        actions[SAVE_RESOURCE]({ state, getters }, iri)

        // then
        assert(getters.localStorage.save.calledWithExactly(iri, state.resourceGraph))
      })
    })

    describe(PUBLISH_RESOURCE, () => {
      it('performs server request', async () => {
        // given
        const dispatch = sinon.spy()
        const client = sinon.mock(new Client())
        const state = {
          resourceGraph: {
            '@context': {
              '@base': 'some base'
            }
          }
        }
        const getters = {
          client: client.object,
          resourceIri: () => 'urn:test:pipeline',
          serializedGraph: () => rdf.dataset()
        }
        client.expects('update').once()

        // when
        await actions[PUBLISH_RESOURCE]({ state, dispatch, getters })

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

    describe(LOAD_RESOURCE, () => {
      it('commits framed JSON-LD to state', async () => {
        // given
        const commit = sinon.spy()
        const client = new Client()
        const frame = {}
        sinon.stub(client, 'fetch').callsFake(() => cf(rdf.dataset()))
        const frameMock = sinon.stub(jsonld, 'frame')
        frameMock.callsFake(() => ({ '@graph': [] }))
        const getters = {
          client,
          resourceIri: () => 'urn:test:id',
          localStorage: {
            load: () => null,
            save: () => null
          }
        }

        // when
        await actions[LOAD_RESOURCE]({ getters, commit }, { frame })

        // then
        assert(commit.calledWith(
          mutations.RESOURCE_LOADED,
          sinon.match({ '@graph': [] })
        ))
        assert(frameMock.calledWith(
          sinon.match.any,
          frame
        ))
      })

      afterEach(() => {
        jsonld.frame.restore()
      })
    })

    describe(ADD_RESOURCE_TYPE, () => {
      it('commits mutation', () => {
        // given
        const commit = sinon.spy()
        const getters = {
          resources: [
            {
              id: 'urn:test:id',
              '@type': 'Pipeline'
            }
          ]
        }

        // when
        actions[ADD_RESOURCE_TYPE]({ getters, commit }, { id: 'urn:test:id', type: 'Readable' })

        // then
        assert(commit.calledWith(
          mutations.RESOURCE_TYPE_ADDED,
          'urn:test:id', 'Readable'
        ))
      })

      it('does not commit mutation if type already present', () => {
        // given
        const commit = sinon.spy()
        const getters = {
          resources: [
            {
              id: 'urn:test:id',
              '@type': 'Pipeline'
            }
          ]
        }

        // when
        actions[ADD_RESOURCE_TYPE]({ getters, commit }, { id: 'urn:test:id', type: 'Pipeline' })

        // then
        assert(commit.notCalled)
      })

      it('does not commit mutation if type already present in array', () => {
        // given
        const commit = sinon.spy()
        const getters = {
          resources: [
            {
              id: 'urn:test:id',
              '@type': [ 'Pipeline', 'Readable' ]
            }
          ]
        }

        // when
        actions[ADD_RESOURCE_TYPE]({ getters, commit }, { id: 'urn:test:id', type: 'Pipeline' })

        // then
        assert(commit.notCalled)
      })

      it('does not commit mutation if resource is not found', () => {
        // given
        const commit = sinon.spy()
        const getters = {
          resources: [
          ]
        }

        // when
        actions[ADD_RESOURCE_TYPE]({ getters, commit }, { id: 'urn:test:id', type: 'Pipeline' })

        // then
        assert(commit.notCalled)
      })
    })
  })
})
