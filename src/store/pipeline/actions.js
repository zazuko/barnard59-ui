import navigateTo from 'ld-navigation/fireNavigation'
import ns from '../../utils/namespaces.js'
import * as mutations from './mutation-types'
import * as actions from './action-types'
import * as rootActions from '../root/action-types'

export const frame = (base) => ({
  '@context': {
    '@base': base,
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
})

export default {
  async [actions.create] ({ commit, dispatch, state, rootState, rootGetters }, slug) {
    commit(mutations.IRI_SET, `${rootState.config.baseUrl}/pipeline/${slug}`)

    const graphJson = frame('')
    delete graphJson['@type']
    graphJson['@graph'] = [ ]

    rootGetters.localStorage.save(`${rootState.config.baseUrl}/pipeline/${slug}`, graphJson)

    navigateTo(`${rootState.config.baseUrl}/pipeline/${slug}#root`)
    dispatch(actions.addPipeline, { slug: 'root' })
    dispatch(actions.select, state.iri)
  },
  async [actions.load] ({ state, commit, dispatch }, { pipelineIri, forceServer = false }) {
    if (pipelineIri.indexOf('#') < 0) {
      pipelineIri = pipelineIri + '#'
    }

    commit(mutations.IRI_SET, pipelineIri)

    await dispatch(rootActions.LOAD_RESOURCE, { iri: state.baseIri, frame: frame(state.baseIri), forceServer }, { root: true })

    dispatch(actions.select, state.iri)
  },
  [actions.reload] ({ state, dispatch }) {
    dispatch(actions.load, { pipelineIri: state.baseIri, forceServer: true })
  },
  async [actions.save] ({ dispatch, state }) {
    // todo: should be dispatched directly on root store
    await dispatch(rootActions.SAVE_RESOURCE, state.baseIri, { root: true })
  },
  async [actions.publish] ({ rootGetters, dispatch }) {
    await dispatch(rootActions.PUBLISH_RESOURCE, null, { root: true })

    dispatch(actions.load, { pipelineIri: rootGetters.resourceIri(), forceServer: true })
  },
  async [actions.addStep] ({ commit, getters, rootGetters }, id) {
    const step = {
      id: `#${id}`,
      'code:implementedBy': {},
      'code:arguments': []
    }

    if (await rootGetters.datasetContains(step.id)) {
      throw new Error('id is use')
    } else {
      commit(mutations.STEP_ADDED, { id, step })
      commit(mutations.STEP_SELECTED, step)
    }
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
  async [actions.addPipeline] ({ dispatch, getters, rootGetters }, { slug }) {
    const id = `#${slug}`
    const newPipeline = {
      '@type': 'Pipeline',
      id,
      steps: {
        stepList: []
      }
    }

    if (await rootGetters.datasetContains(id)) {
      throw new Error('id is use')
    } else {
      dispatch(rootActions.ADD_RESOURCE, newPipeline, { root: true })
      dispatch(actions.select, id)
    }
  },
  [actions.select] ({ commit, rootGetters }, pipelineIri) {
    const pipeline = rootGetters.resources.find(res => res.id === pipelineIri)

    if (pipeline) {
      commit(mutations.PIPELINE_SELECTED, pipeline)
    }
  }
}
