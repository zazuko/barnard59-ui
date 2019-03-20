import {
  PIPELINE_SELECTED, IRI_SET,
  STEP_SELECTED, STEP_ADDED,
  REPLACE_VARIABLES, STEP_REMOVED,
  STEP_UPDATED
} from '../../src/store/pipeline/mutation-types'
import mutations from '../../src/store/pipeline/mutations'
import { expect } from 'chai'

describe('pipeline store', () => {
  describe('mutation', () => {
    describe(PIPELINE_SELECTED, () => {
      const mutation = mutations[PIPELINE_SELECTED]

      it('sets the root resource as state instance', () => {
        // given
        const state = {
          iri: 'http://example.resource'
        }
        const pipeline = {
          id: 'http://example.resource'
        }

        // when
        mutation(state, pipeline)

        // then
        expect(state.instance.id).to.be.equal(state.iri)
      })

      it('ensures that instance is set with stepList', () => {
        // given
        const state = {
          iri: 'http://example.resource'
        }
        const pipeline = {
          id: 'http://example.resource'
        }

        // when
        mutation(state, pipeline)

        // then
        expect(state.instance.steps.stepList).to.be.an('array')
      })
    })

    describe(IRI_SET, () => {
      const mutation = mutations[IRI_SET]
      const iri = 'http://example.com/pipeline/1'

      it('sets state property', () => {
        // given
        const state = {}

        // when
        mutation(state, iri)

        // then
        expect(state.iri).to.be.equal(iri)
      })
    })

    describe(STEP_SELECTED, () => {
      const mutation = mutations[STEP_SELECTED]

      it('set state property', () => {
        // given
        const state = {}
        const step = {
          id: 'urn:test:id'
        }

        // when
        mutation(state, step)

        // then
        expect(state.selectedStep.id).to.be.equal('urn:test:id')
      })
    })

    describe(STEP_ADDED, () => {
      const mutation = mutations[STEP_ADDED]

      it('adds step at index', () => {
        // given
        const state = {
          instance: {
            steps: {
              stepList: [
                'step 1',
                'step 2',
                'step 4'
              ]
            }
          }
        }

        // when
        mutation(state, {
          index: 2,
          step: 'step 3'
        })

        // then
        expect(state.instance.steps.stepList[2]).to.be.equal('step 3')
      })
    })

    describe(REPLACE_VARIABLES, () => {
      const mutation = mutations[REPLACE_VARIABLES]

      it("updates instance's variables", () => {
        // given
        const state = {
          instance: {
          }
        }

        // when
        mutation(state, [
          {
            name: 'path',
            value: './tmp'
          }
        ])

        // then
        expect(state.instance.variables.length).to.be.equal(1)
        expect(state.instance.variables[0].variable).to.include({
          name: 'path',
          value: './tmp'
        })
      })

      it('adds @type to variables', () => {
        // given
        const state = {
          instance: {
          }
        }

        // when
        mutation(state, [
          {
            name: 'path',
            value: './tmp'
          }
        ])

        // then
        expect(state.instance.variables[0].variable).to.include({
          '@type': 'Variable'
        })
      })

      it('ignores props other than name and value', () => {
        // given
        const state = {
          instance: {
          }
        }

        // when
        mutation(state, [
          {
            foo: 'bar'
          }
        ])

        // then
        expect(state.instance.variables[0].variable).to.not.contain.key('foo')
      })
    })

    describe(STEP_REMOVED, () => {
      const mutation = mutations[STEP_REMOVED]

      it('it updates the instance steps', () => {
        // given
        const state = {
          instance: {
            steps: {
              stepList: [1, 2, 3]
            }
          }
        }

        // when
        mutation(state, 1)

        // then
        expect(state.instance.steps.stepList).to.have.all.members([1, 3])
      })
    })

    describe(STEP_UPDATED, () => {
      const mutation = mutations[STEP_UPDATED]

      it('replaces the step', () => {
        // given
        const state = {
          instance: {
            steps: {
              stepList: ['old step']
            }
          }
        }

        // when
        mutation(state, {
          index: 0,
          step: 'new step'
        })

        // then
        expect(state.instance.steps.stepList[0]).to.equal('new step')
      })
    })
  })
})
