import * as m from './mutation-types'
import Vue from 'vue'

export default {
  [m.PIPELINE_SELECTED] (state, pipeline) {
    state.instance = pipeline

    if (pipeline) {
      if (!state.instance.steps) {
        state.instance.steps = {}
      }

      if (!state.instance.steps.stepList) {
        state.instance.steps.stepList = []
      }
    }
  },
  [m.IRI_SET] (state, pipelineIri) {
    state.baseIri = pipelineIri.slice(0, pipelineIri.indexOf('#'))
    state.iri = pipelineIri.slice(state.baseIri.length)
  },
  [m.STEP_REMOVED] (state, index) {
    state.instance.steps.stepList.splice(index, 1)
  },
  [m.STEP_ADDED] (state, { step }) {
    if (!state.instance.steps) {
      state.instance.steps = {}
    }
    if (!state.instance.steps.stepList) {
      state.instance.steps.stepList = []
    }

    state.instance.steps.stepList.push(step)
  },
  [m.STEP_SELECTED] (state, step) {
    state.selectedStep = step
  },
  [m.STEP_UPDATED] (state, { index, step }) {
    state.instance.steps.stepList.splice(index, 1, step)
  },
  [m.REPLACE_VARIABLES] (state, variables) {
    Vue.set(state.instance, 'variables', variables.map(({ name, value }) => ({
      variable: { '@type': 'Variable', name, value }
    })))
  }
}
