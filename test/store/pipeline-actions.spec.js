import { expect, assert } from 'chai'
import { load, save, addStep, deleteStep, selectStep } from '../../src/store/pipeline-action-types'
import * as mutations from '../../src/store/pipeline-mutation-types'
import actions from '../../src/store/pipeline-actions'
import * as sinon from 'sinon'
import Client from '../../src/Client'
import cf from 'clownface'
import rdf from 'rdf-ext'
import { code } from '../../src/utils/namespaces'

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

    it('commits the pipeline body to state', async () => {
      // given
      const client = sinon.mock(new Client())
      const commit = sinon.spy()
      const rootState = { client: client.object }
      const iri = 'urn:pipeline:1'
      client.expects('fetch').once().resolves(cf(rdf.dataset()))

      // when
      await actions.load({ commit, rootState }, iri)

      // then
      expect(commit.secondCall.args[0]).to.equal(mutations.PIPELINE_LOADED)
      expect(commit.secondCall.args[1]['@graph']).to.be.an('array')
    })
  })

  describe(save, () => {
    it('saves the pipeline', async () => {
      // given
      const state = {
        iri: 'urn:test:pipeline',
        '@graph': {
          'urn:test:pipeline': {
            '@type': code.Pipeline
          }
        }
      }
      const dispatch = sinon.spy()
      const client = sinon.mock(new Client())
      const rootState = { client: client.object }
      client.expects('update').once()

      // when
      await actions.save({ state, rootState, dispatch })

      // then
      client.verify()
    })

    it('reloads the pipeline', async () => {
      // given
      const state = {
        iri: 'urn:test:pipeline',
        '@graph': {
          'urn:test:pipeline': {
            '@type': code.Pipeline
          }
        }
      }
      const dispatch = sinon.spy()
      const client = sinon.mock(new Client())
      const rootState = { client: client.object }
      client.expects('update').once()

      // when
      await actions.save({ state, rootState, dispatch })

      // then
      expect(dispatch.firstCall.args).to.deep.equal([
        load, state.iri
      ])
    })
  })

  describe(addStep, function () {
    it('commits an empty step', () => {
      // given
      const commit = sinon.spy()
      const getters = {}

      // when
      actions.addStep({ commit, getters }, 5)

      // then
      assert(commit.calledWith(
        mutations.STEP_ADDED,
        sinon.match({
          index: 5,
          step: sinon.match.has('id')
            .and(sinon.match.has('code:implementedBy', sinon.match.object))
            .and(sinon.match.has('code:arguments', sinon.match.array))
        })
      ))
    })

    it('selects the new step step', () => {
      // given
      const commit = sinon.spy()
      const getters = {}

      // when
      actions.addStep({ commit, getters }, 5)

      // then
      assert(commit.calledWith(
        mutations.STEP_SELECTED
      ))
    })
  })

  describe(deleteStep, () => {
    it('unselects steps', () => {
      // given
      const commit = sinon.spy()
      const index = 3

      // when
      actions.deleteStep({ commit }, index)

      // then
      assert(commit.calledWith(
        mutations.STEP_REMOVED,
        index
      ))
    })

    it('unselects steps', () => {
      // given
      const commit = sinon.spy()
      const index = 3

      // when
      actions.deleteStep({ commit }, index)

      // then
      assert(commit.calledWith(
        mutations.STEP_SELECTED,
        null
      ))
    })
  })

  describe(selectStep, () => {
    it('commits the selection', () => {
      // given
      const commit = sinon.spy()
      const step = {}

      // when
      actions.selectStep({ commit }, step)

      // then
      assert(commit.calledWith(
        mutations.STEP_SELECTED,
        step
      ))
    })
  })
})
