import { expect, assert } from 'chai'
import {
  load, save, addStep, saveVariable,
  deleteStep, selectStep, updateStep,
  addVariable, deleteVariable, addPipeline,
  select } from '../../src/store/pipeline/action-types'
import * as mutations from '../../src/store/pipeline/mutation-types'
import actions from '../../src/store/pipeline/actions'
import * as sinon from 'sinon'
import { code } from '../../src/utils/namespaces'
import * as rootActions from '../../src/store/root/action-types'

describe('pipeline store', () => {
  describe('action', () => {
    describe(load, () => {
      it('commits iri to state', async () => {
        // given
        const dispatch = sinon.spy()
        const commit = sinon.spy()
        const iri = 'urn:pipeline:1'
        const rootGetters = {
          resources: []
        }

        // when
        await actions.load({ commit, dispatch, rootGetters }, iri)

        // then
        expect(commit.firstCall.args[0]).to.equal(mutations.IRI_SET)
      })

      it('selects the pipeline', async () => {
        // given
        const dispatch = sinon.spy()
        const commit = sinon.spy()
        const iri = 'urn:pipeline:1'

        // when
        await actions.load({ commit, dispatch }, iri)

        // then
        assert(dispatch.calledWith(select, iri))
      })
    })

    describe(save, () => {
      it('saves the root resource', async () => {
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

        // when
        await actions.save({ state, dispatch })

        // then
        assert(dispatch.calledWith(
          rootActions.SAVE_RESOURCE,
          null,
          sinon.match({ root: true })
        ))
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

        // when
        await actions.save({ state, dispatch })

        // then
        assert(dispatch.calledWith(
          load,
          state.iri)
        )
      })
    })

    describe(addStep, () => {
      it('commits an empty step', async () => {
        // given
        const commit = sinon.spy()
        const getters = {}
        const rootGetters = {
          datasetContains: () => false
        }

        // when
        await actions.addStep({ commit, getters, rootGetters }, 5)

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

      it(`does not commit step ${mutations.STEP_ADDED} when URI already exists in dataset`, async () => {
        // given
        const commit = sinon.spy()
        const getters = {}
        const rootGetters = {
          datasetContains: () => true
        }

        // when
        await actions.addStep({ commit, getters, rootGetters }, 5).catch(() => {})

        // then
        assert(commit.neverCalledWith(
          mutations.STEP_ADDED
        ))
      })

      it('selects the new step step', async () => {
        // given
        const commit = sinon.spy()
        const getters = {}
        const rootGetters = {
          datasetContains: () => false
        }

        // when
        await actions.addStep({ commit, getters, rootGetters }, 5)

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

    describe(updateStep, () => {
      it('clears selection', () => {
        // given
        const commit = sinon.spy()
        const getters = {
          steps: []
        }

        // when
        actions.updateStep({ commit, getters }, {})

        // then
        assert(commit.calledWith(
          mutations.STEP_SELECTED,
          null
        ))
      })

      it('commits updated step', () => {
        // given
        const commit = sinon.spy()
        const getters = {
          steps: [{
            id: 'step1'
          }, {
            id: 'step2'
          }, {
            id: 'step3'
          }]
        }
        const step = {
          id: 'step2'
        }

        // when
        actions.updateStep({ commit, getters }, step)

        // then
        assert(commit.calledWith(
          mutations.STEP_UPDATED,
          sinon.match.has('index', 1)
            .and(sinon.match.has('step', step))
        ))
      })

      it('does not commit step if not found in state', () => {
        // given
        const commit = sinon.spy()
        const getters = {
          steps: [{
            id: 'step1'
          }, {
            id: 'step2'
          }, {
            id: 'step3'
          }]
        }
        const step = {
          id: 'step4'
        }

        // when
        actions.updateStep({ commit, getters }, step)

        // then
        assert(commit.neverCalledWith(
          mutations.STEP_UPDATED
        ))
      })
    })

    describe(addVariable, () => {
      it('appends the variable', () => {
        // given
        const name = 'foo'
        const value = 'bar'
        const commit = sinon.spy()
        const getters = {
          variables: [ {}, {} ]
        }

        // when
        actions.addVariable({ commit, getters }, { name, value })

        // then
        assert(commit.calledWith(
          mutations.REPLACE_VARIABLES,
          [
            sinon.match.object,
            sinon.match.object,
            sinon.match({ name, value })
          ]
        ))
      })

      it('ignores superfluous properties', () => {
        // given
        const name = 'foo'
        const value = 'bar'
        const commit = sinon.spy()
        const getters = {
          variables: [ ]
        }

        // when
        actions.addVariable({ commit, getters }, { name, value, something: 'else' })

        // then
        expect(commit.firstCall.lastArg[0]).to.deep.equal({ name, value })
      })
    })

    describe(deleteVariable, () => {
      it('commits array with variable removed', () => {
        // given
        const one = {}
        const two = {}
        const three = {}
        const getters = {
          variables: [ one, two, three ]
        }
        const commit = sinon.spy()

        // when
        actions.deleteVariable({ commit, getters }, 1)

        // then
        assert(commit.calledWith(
          mutations.REPLACE_VARIABLES,
          [
            one, three
          ]
        ))
      })
    })

    describe(saveVariable, () => {
      it('replaces the saved variable', () => {
        // given
        const commit = sinon.spy()
        const getters = {
          variables: [{ name: 'old', value: 'foo' }]
        }

        // when
        actions.saveVariable({ commit, getters }, { index: 0, name: 'new', value: 'bar' })

        // then
        assert(commit.calledWith(
          mutations.REPLACE_VARIABLES,
          [ sinon.match({ name: 'new', value: 'bar' }) ]
        ))
      })
    })

    describe(addPipeline, () => {
      it('appends new resource to graph', async () => {
        // given
        const dispatch = sinon.spy()
        const getters = {
          baseUrl: 'urn:pipeline:'
        }
        const rootGetters = {
          datasetContains: () => false
        }

        // when
        await actions.addPipeline({ getters, dispatch, rootGetters }, { slug: 'new' })

        // then
        assert(dispatch.calledWith(
          rootActions.ADD_RESOURCE,
          sinon.match({
            id: 'urn:pipeline:new',
            '@type': 'Pipeline'
          }),
          sinon.match({ root: true })
        ))
      })

      it('selects the new pipeline', async () => {
        // given
        const dispatch = sinon.spy()
        const getters = {
          baseUrl: 'urn:pipeline:'
        }
        const rootGetters = {
          datasetContains: () => false
        }

        // when
        await actions.addPipeline({ dispatch, getters, rootGetters }, { slug: 'new' })

        // then
        assert(dispatch.calledWith(select, 'urn:pipeline:new'))
      })

      it(`does not dispatch add ${rootActions.ADD_RESOURCE} when URI already exists in dataset`, async () => {
        // given
        const dispatch = sinon.spy()
        const getters = {
          baseUrl: 'urn:pipeline:'
        }
        const rootGetters = {
          datasetContains: () => true
        }

        // when
        await actions.addPipeline({ dispatch, getters, rootGetters }, { slug: 'new' }).catch(() => {})

        // then
        assert(dispatch.neverCalledWith(rootActions.ADD_RESOURCE))
      })
    })

    describe(select, () => {
      it('commits selected pipeline', () => {
        // given
        const commit = sinon.spy()
        const iri = 'urn:test:pipeline'
        const rootGetters = {
          resources: [{ id: iri }]
        }

        // when
        actions.select({ commit, rootGetters }, iri)

        // then
        assert(commit.calledWith(
          mutations.PIPELINE_SELECTED,
          sinon.match({ id: iri })
        ))
      })

      it('does nothing when pipeline is not found in graph', async () => {
        // given
        const commit = sinon.spy()
        const iri = 'urn:test:pipeline'
        const rootGetters = {
          resources: []
        }

        // when
        actions.select({ commit, rootGetters }, iri)

        // then
        assert(commit.notCalled)
      })
    })
  })
})
