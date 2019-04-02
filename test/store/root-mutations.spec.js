import { RESOURCE_LOADED, RESOURCE_ADDED, RESOURCE_TYPE_ADDED, RESOURCE_TYPE_REMOVED } from '../../src/store/root/mutation-types'
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

    describe(RESOURCE_TYPE_ADDED, () => {
      const mutation = mutations[RESOURCE_TYPE_ADDED]

      it('appends to @type array', () => {
        // given
        const state = {
          resourceGraph: {
            '@graph': [
              {
                'id': 'urn:test:id',
                '@type': [ 'Pipeline', 'Readable' ]
              }
            ]
          }
        }

        // when
        mutation(state, 'urn:test:id', 'ReadableObjectMode')

        // then
        expect(state.resourceGraph['@graph'][0]['@type']).to.contain('ReadableObjectMode')
        expect(state.resourceGraph['@graph'][0]['@type'].length).to.equal(3)
      })

      it('changes single @type to array', () => {
        // given
        const state = {
          resourceGraph: {
            '@graph': [
              {
                'id': 'urn:test:id',
                '@type': 'Pipeline'
              }
            ]
          }
        }

        // when
        mutation(state, 'urn:test:id', 'ReadableObjectMode')

        // then
        expect(state.resourceGraph['@graph'][0]['@type']).to.contain('ReadableObjectMode')
        expect(state.resourceGraph['@graph'][0]['@type']).to.contain('Pipeline')
        expect(state.resourceGraph['@graph'][0]['@type'].length).to.equal(2)
      })
    })

    describe(RESOURCE_TYPE_REMOVED, () => {
      const mutation = mutations[RESOURCE_TYPE_REMOVED]

      it('remove @type from array', () => {
        // given
        const state = {
          resourceGraph: {
            '@graph': [
              {
                'id': 'urn:test:id',
                '@type': [ 'Pipeline', 'Readable' ]
              }
            ]
          }
        }

        // when
        mutation(state, 'urn:test:id', 'Readable')

        // then
        expect(state.resourceGraph['@graph'][0]['@type'].length).to.equal(1)
        expect(state.resourceGraph['@graph'][0]['@type']).to.not.contain('Readable')
      })

      it('replaces single @type with empty array', () => {
        // given
        const state = {
          resourceGraph: {
            '@graph': [
              {
                'id': 'urn:test:id',
                '@type': 'Readable'
              }
            ]
          }
        }

        // when
        mutation(state, 'urn:test:id', 'Readable')

        // then
        expect(state.resourceGraph['@graph'][0]['@type'].length).to.equal(0)
        expect(state.resourceGraph['@graph'][0]['@type']).to.be.an('array')
      })
    })
  })
})
