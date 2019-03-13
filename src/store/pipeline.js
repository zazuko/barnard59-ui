import ns from '../utils/namespaces.js'
import * as m from './pipeline-mutation-types'
import actions from './pipeline-actions'

export const frame = {
  '@context': {
    'id': '@id',
    '@vocab': ns.p('').value,
    'code': ns.code('').value,
    'code:arguments': {
      '@container': '@list'
    },
    'stepList': {
      '@container': '@list'
    },
    'code:link': {
      '@type': '@id'
    },
    'variables': {
      '@container': '@set'
    }
  },
  '@type': 'https://pipeline.described.at/Pipeline'
}

export const mutations = {
  [m.PIPELINE_LOADED] (state, jsonLd) {
    state.graph = jsonLd
    state.resources = jsonLd['@graph']
    state.instance = state.resources.find(res => res.id === state.iri)

    if (!state.instance.steps) {
      state.instance.steps = {}
    }

    if (!state.instance.stepList) {
      state.instance.steps.stepList = []
    }
  },
  [m.IRI_SET] (state, pipelineIri) {
    state.iri = pipelineIri
  },
  [m.STEP_REMOVED] (state, index) {
    state.instance.steps.stepList.splice(index, 1)
  },
  [m.STEP_ADDED] (state, { index, step }) {
    if (!state.instance.steps) {
      state.instance.steps = {}
    }
    if (!state.instance.steps.stepList) {
      state.instance.steps.stepList = []
    }

    state.instance.steps.stepList.splice(index, 0, step)
  },
  [m.STEP_SELECTED] (state, step) {
    state.selectedStep = step
  },
  [m.STEP_UPDATED] (state, { index, step }) {
    state.instance.steps.stepList.splice(index, 1, step)
  },
  [m.REPLACE_VARIABLES] (state, variables) {
    state.instance.variables = variables.map(({ name, value }) => ({
      variable: { '@type': 'Variable', name, value }
    }))
  }
}

export default {
  namespaced: true,
  state: {
    iri: '',
    graph: {},
    resources: [],
    selectedStep: null,
    instance: {}
  },
  getters: {
    baseUrl: (state) => {
      if (state.iri.indexOf('#') !== -1) {
        return `${state.iri.split('#')[0]}#`
      } else {
        return state.iri.split('/').slice(0, -1).join('/')
      }
    },
    steps: (state) => {
      if (state.instance.steps) {
        return state.instance.steps.stepList
      }

      return []
    },
    variables: (state) => {
      if (state.instance.variables) {
        return state.instance.variables.map(v => v.variable)
      }

      return []
    }
  },
  mutations,
  actions
}
