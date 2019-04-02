import { expect, assert } from 'chai'
import {
  load, save, addStep, saveVariable,
  deleteStep, selectStep, updateStep,
  addVariable, deleteVariable, addPipeline,
  select, publish } from '../../src/store/pipeline/action-types'
import * as mutations from '../../src/store/pipeline/mutation-types'
import actions from '../../src/store/pipeline/actions'
import * as sinon from 'sinon'
import * as rootActions from '../../src/store/root/action-types'
import * as navigateTo from 'ld-navigation/fireNavigation'

describe('pipeline store', () => {
  describe('action', () => {
    describe(load, () => {
      it('commits iri to state', async () => {
        // given
        const dispatch = sinon.spy()
        const commit = sinon.spy()
        const iri = 'urn:test:pipeline#name'
        const state = {
          baseIri: 'urn:test:pipeline#'
        }

        // when
        await actions.load({ commit, dispatch, state }, { pipelineIri: iri })

        // then
        assert(commit.calledWith(mutations.IRI_SET, 'urn:test:pipeline#name'))
      })

      it('commits iri with hash to state', async () => {
        // given
        const dispatch = sinon.spy()
        const commit = sinon.spy()
        const iri = 'urn:test:pipeline'
        const state = {
          baseIri: 'urn:test:pipeline'
        }

        // when
        await actions.load({ commit, dispatch, state }, { pipelineIri: iri })

        // then
        assert(commit.calledWith(mutations.IRI_SET, 'urn:test:pipeline#'))
      })

      it('selects the pipeline', async () => {
        // given
        const dispatch = sinon.spy()
        const commit = sinon.spy()
        const iri = 'urn:test:pipeline#name'
        const state = {
          baseIri: 'urn:test:pipeline#',
          iri: '#name'
        }

        // when
        await actions.load({ commit, dispatch, state }, { pipelineIri: iri })

        // then
        assert(dispatch.calledWith(select, '#name'))
      })
    })

    describe(save, () => {
      it('dispatches save action', () => {
        // given
        const dispatch = sinon.spy()
        const state = {
          baseIri: 'iri'
        }

        // when
        actions.save({ dispatch, state })

        // then
        assert(dispatch.calledWithExactly(
          rootActions.SAVE_RESOURCE,
          'iri',
          {
            root: true
          }
        ))
      })
    })

    describe(publish, () => {
      it('reloads the pipeline', async () => {
        // given
        const state = {
          iri: '#name'
        }
        const rootState = {
          resourceGraph: {
            '@context': {
              '@base': 'urn:test:pipeline'
            },
            '@graph': []
          }
        }
        const dispatch = sinon.spy()
        const rootGetters = {
          localStorage: {
            delete: () => {}
          }
        }
        const navigationSpy = sinon.spy(navigateTo, 'default')

        // when
        await actions.publish({ rootState, state, rootGetters, dispatch })

        // then
        assert(navigationSpy.calledWith(
          'urn:test:pipeline#name')
        )
      })
    })

    describe(addStep, () => {
      it('commits an empty step', async () => {
        // given
        const commit = sinon.spy()
        const rootGetters = {
          datasetContains: () => false
        }

        // when
        await actions.addStep({ commit, rootGetters }, 'step name')

        // then
        assert(commit.calledWith(
          mutations.STEP_ADDED,
          sinon.match({
            step: sinon.match.has('id', '#step name')
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
        const rootGetters = {
          datasetContains: () => false
        }

        // when
        await actions.addPipeline({ dispatch, rootGetters }, { slug: 'new' })

        // then
        assert(dispatch.calledWith(
          rootActions.ADD_RESOURCE,
          sinon.match({
            id: '#new',
            '@type': 'Pipeline'
          }),
          sinon.match({ root: true })
        ))
      })

      it('selects the new pipeline', async () => {
        // given
        const dispatch = sinon.spy()
        const rootGetters = {
          datasetContains: () => false
        }

        // when
        await actions.addPipeline({ dispatch, rootGetters }, { slug: 'new' })

        // then
        assert(dispatch.calledWith(select, '#new'))
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
