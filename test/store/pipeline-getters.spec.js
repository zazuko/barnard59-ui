import getters from '../../src/store/pipeline/getters'
import { expect } from 'chai'

describe('pipeline getter', () => {
  describe('variables', () => {
    it('returns inner variables', () => {
      // given
      const state = {
        instance: {
          variables: [
            {
              variable: {
                name: 'foo',
                value: 'bar'
              }
            }
          ]
        }
      }

      // when
      const variables = getters.variables(state)

      // then
      expect(variables[0].name).to.be.equal('foo')
      expect(variables[0].value).to.be.equal('bar')
    })

    it('returns empty array if instance does not have variables', () => {
      // given
      const state = {
        instance: {}
      }

      // when
      const variables = getters.variables(state)

      // then
      expect(variables).to.be.an('array')
      expect(variables.length).to.equal(0)
    })

    it('excludes variables which are not objects', () => {
      // given
      const state = {
        instance: {
          variables: [
            {
              variable: []
            },
            {
              variable: 'foobar'
            },
            {
              variable: {}
            }
          ]
        }
      }

      // when
      const variables = getters.variables(state)

      // then
      expect(variables.length).to.equal(1)
    })
  })

  describe('pipelines', () => {
    it('returns all resources of type pipeline', () => {
      // given
      const rootGetters = {
        resources: [
          {
            id: 'urn:pipeline:id',
            '@type': 'Pipeline'
          },
          {
            id: 'not_pipeline'
          }
        ]
      }

      // when
      const pipelines = getters.pipelines(null, null, null, rootGetters)

      // then
      expect(pipelines.length).to.equal(1)
      expect(pipelines.map(p => p.id)).to.contain('urn:pipeline:id')
    })
  })
})
