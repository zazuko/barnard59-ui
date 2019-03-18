import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Variables from '../../src/components/Variables'
import { expect } from 'chai'
import { saveVariable } from '../../src/store/pipeline-action-types'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('<Variables>', () => {
  let actions
  let store

  beforeEach(() => {
    actions = {
      [saveVariable]: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        pipeline: {
          namespaced: true,
          actions
        }
      }
    })
  })

describe('<Variables>', () => {
  describe('items getter', () => {
    it('should return an item for each ', () => {
      // given
      const options = {
        propsData: {
          variables: [1, 2, 3].map(i => ({ name: `foo${i}`, value: `bar${i}` }))
        }
      }

      // when
      const component = mount(Variables, options).vm

      // then
      expect(component.items.length).to.equal(3)
      expect(component.items[1]).to.contain({
        name: 'foo2',
        value: 'bar2'
      })
    })

    it('calls save action when button clicked', () => {
      // given
      const options = {
        store,
        localVue,
        propsData: {
          variables: [
            {
              'name': 'foo',
              'value': 'bar'
            }
          ]
        }
      }
      const component = mount(Variables, options)
      component.find('input.name').element.value = 'filename'
      component.find('input.value').element.value = 'test.txt'

      // when
      component.find('button.save').element.click()

      // then
      expect(actions[saveVariable].mock.calls.length).to.be.equal(1)
    })
  })
})
