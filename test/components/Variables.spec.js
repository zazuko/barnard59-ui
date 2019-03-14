import { mount } from '@vue/test-utils'
import Variables from '../../src/components/Variables'
import { expect } from 'chai'

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
  })
})
