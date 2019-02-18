import { PIPELINE_LOADED } from '../../src/store/pipeline-mutations'
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
})
