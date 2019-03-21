import ns from '../../utils/namespaces.js'
import * as mutations from './mutation-types'
import * as actions from './action-types'
import * as rootActions from '../root/action-types'

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

export default {
  async [actions.load] ({ commit, dispatch }, pipelineIri) {
    commit(mutations.IRI_SET, pipelineIri)

    await dispatch(rootActions.LOAD_RESOURCE, frame, { root: true })

    dispatch(actions.select, pipelineIri)
  },
  async [actions.save] ({ dispatch, state }) {
    await dispatch(rootActions.SAVE_RESOURCE, null, { root: true })

    dispatch(actions.load, state.iri)
  },
  [actions.addStep] ({ commit, getters }, index) {
    const step = {
      id: `${getters.baseUrl}${index}`,
      'code:implementedBy': {},
      'code:arguments': []
    }

    commit(mutations.STEP_ADDED, { index, step })
    commit(mutations.STEP_SELECTED, step)
  },
  [actions.deleteStep] ({ commit }, index) {
    commit(mutations.STEP_REMOVED, index)
    commit(mutations.STEP_SELECTED, null)
  },
  [actions.selectStep] ({ state, commit }, step) {
    commit(mutations.STEP_SELECTED, step)
  },
  [actions.updateStep] ({ commit, getters }, step) {
    const index = getters.steps.findIndex(s => s.id === step.id)

    if (index >= 0) {
      commit(mutations.STEP_UPDATED, { index, step })
    }

    commit(mutations.STEP_SELECTED, null)
  },
  [actions.addVariable] ({ commit, getters }, { name, value }) {
    commit(mutations.REPLACE_VARIABLES, [
      ...getters.variables,
      {
        name, value
      }
    ])
  },
  [actions.saveVariable] ({ commit, getters }, { index, name, value }) {
    const variables = getters.variables
    variables.splice(index, 1, { name, value })

    commit(mutations.REPLACE_VARIABLES, variables)
  },
  [actions.deleteVariable] ({ commit, getters }, index) {
    const variables = getters.variables
    variables.splice(index, 1)

    commit(mutations.REPLACE_VARIABLES, variables)
  },
  [actions.addPipeline] ({ state, dispatch }, { slug }) {
    const id = `${state.baseIri}${slug}`
    const newPipeline = {
      '@type': 'Pipeline',
      id
    }

    dispatch(rootActions.ADD_RESOURCE, newPipeline, { root: true })
    dispatch(actions.select, id)
  },
  [actions.select] ({ commit, rootGetters }, pipelineIri) {
    commit(mutations.PIPELINE_SELECTED, rootGetters.resources.find(res => res.id === pipelineIri))
  }
}
