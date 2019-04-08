import { createLocalVue, mount } from '@vue/test-utils'
import PipelineTypes from '../../src/components/PipelineTypes'
import { expect, assert } from 'chai'
import Vuex from 'vuex'
import { addPipelineType, removePipelineType } from '../../src/store/pipeline/action-types'
import BFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox'
import * as sinon from 'sinon'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('<pipeline-types>', () => {
  let actions
  let store
  let state

  beforeEach(() => {
    actions = {
      [addPipelineType]: sinon.spy(),
      [removePipelineType]: sinon.spy()
    }
    state = {}
    store = new Vuex.Store({
      modules: {
        pipeline: {
          namespaced: true,
          actions,
          state
        }
      }
    })
  })

  it('sets checkboxes according to state', () => {
    state.instance = {
      '@type': ['Readable', 'Writable', 'ReadableObjectMode', 'WritableObjectMode']
    }
    const options = {
      store,
      localVue
    }

    // when
    const component = mount(PipelineTypes, options)

    // then
    const checkboxes = component.findAll(BFormCheckbox)
    checkboxes.wrappers.forEach(cb => {
      expect(cb.vm.checked).to.be.true
    })
  })

  it('dispatches action to add type when checked', () => {
    state.instance = {
      '@type': []
    }
    const options = {
      store,
      localVue
    }

    // when
    const component = mount(PipelineTypes, options)
    const checkbox = component.findAll(BFormCheckbox).at(0)
    checkbox.element.querySelector('input').click()

    // then
    assert(actions[addPipelineType].calledWith(sinon.match.object, 'Readable'))
  })

  it('dispatches action to remove type when unchecked', () => {
    state.instance = {
      '@type': ['Readable']
    }
    const options = {
      store,
      localVue
    }

    // when
    const component = mount(PipelineTypes, options)
    const checkbox = component.findAll(BFormCheckbox).at(0)
    checkbox.element.querySelector('input').click()

    // then
    assert(actions[removePipelineType].calledWith(sinon.match.object, 'Readable'))
  })
})
