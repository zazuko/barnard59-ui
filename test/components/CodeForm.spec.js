import { mount } from '@vue/test-utils'
import CodeForm from '../../src/components/CodeForm'
import { expect } from 'chai'

describe('<code-form>', () => {
  it('should initialize when operation has no implementation', () => {
    // given
    const codeForm = mount(CodeForm, {
      propsData: {
        operation: {}
      }
    })

    // then
    expect(codeForm.vm.type).to.be.null
  })

  it('should initialize when operation type cannot be found', () => {
    // given
    const codeForm = mount(CodeForm, {
      propsData: {
        operation: {
          'code:implementedBy': {
            'type': 'no-such-type'
          }
        }
      }
    })

    // then
    expect(codeForm.vm.type).to.be.null
  })
})
