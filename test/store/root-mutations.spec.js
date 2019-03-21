import { RESOURCE_LOADED, RESOURCE_ADDED } from '../../src/store/root/mutation-types'
import mutations from '../../src/store/root/mutations'
import { expect } from 'chai'

describe('root store', () => {
  describe('mutation', () => {
    describe(RESOURCE_LOADED, () => {
      const mutation = mutations[RESOURCE_LOADED]

      it('sets the @graph object into state', () => {
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
        expect(state.resourceGraph).to.be.ok
      })
    })

    describe(RESOURCE_ADDED, () => {
      const mutation = mutations[RESOURCE_ADDED]

      it('appends resource to resource graph', () => {
        // given
        const state = {
          resourceGraph: {
            '@graph': []
          }
        }
        const resource = {}

        // when
        mutation(state, resource)

        // then
        expect(state.resourceGraph['@graph']).to.contain(resource)
      })
    })
  })
})
