import store from '../../src/store/pipeline'
import { expect } from 'chai'

const { getters } = store

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
})
