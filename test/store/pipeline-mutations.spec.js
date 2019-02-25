import { PIPELINE_LOADED, IRI_SET, STEP_SELECTED } from '../../src/store/pipeline-mutations'
import { mutations } from '../../src/store/pipeline'
import { expect } from 'chai'

describe('mutations', () => {
  describe(PIPELINE_LOADED, () => {
    const mutation = mutations[PIPELINE_LOADED]

    it('sets the @graph object into state', () => {
      // given
      const state = {}
      const graph = []

      // when
      mutation(state, {
        '@graph': graph
      })

      // then
      expect(state.resources).to.be.an('array')
    })

    it('sets the root resource as state instance', () => {
      // given
      const state = {
        iri: 'http://example.resource'
      }
      const graph = [
        {
          id: 'http://example.resource'
        }
      ]

      // when
      mutation(state, {
        '@graph': graph
      })

      // then
      expect(state.instance.id).to.be.equal(state.iri)
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
      expect(state.step.id).to.be.equal('urn:test:id')
    })
  })
})
