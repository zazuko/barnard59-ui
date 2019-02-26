import * as mutations from './pipeline-mutation-types'
import rdf from 'rdf-ext'
import { promises as jsonld } from 'jsonld'
import NtriplesSerializer from '@rdfjs/serializer-ntriples'
import JsonldParser from '@rdfjs/parser-jsonld'
import clownface from 'clownface'
import { frame } from './pipeline'
import Readable from 'readable-stream'
import * as actions from './pipeline-action-types'

const ntriplesSerializer = new NtriplesSerializer()
const jsonldParser = new JsonldParser()

export default {
  async [actions.load] ({ commit, rootState }, pipelineIri) {
    commit(mutations.IRI_SET, pipelineIri)

    let cf = await rootState.client.fetch(pipelineIri)
    const stream = ntriplesSerializer.import(cf.dataset.toStream())

    let triples = ''
    stream.on('data', (data) => {
      triples += data.toString()
    })

    await rdf.waitFor(stream)
    const pipelineJson = await jsonld.frame(await jsonld.fromRDF(triples), frame)

    commit(mutations.PIPELINE_LOADED, pipelineJson)
  },
  async [actions.save] ({ dispatch, state, rootState }) {
    const input = new Readable({
      read: () => {
        input.push(JSON.stringify(state.graph))
        input.push(null)
      }
    })

    const graph = rdf.dataset()
    const jsonldStream = jsonldParser.import(input)

    jsonldStream.on('data', (quad) => {
      graph.add(quad)
    })

    await rdf.waitFor(jsonldStream)
    await rootState.client.update(clownface(graph).node(state.iri))
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
  }
}
