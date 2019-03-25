import LdNavigator from 'ld-navigation/LdNavigator'
import Readable from 'readable-stream'
import rdf from 'rdf-ext'
import JsonldParser from '@rdfjs/parser-jsonld'
import clownface from 'clownface'

const jsonldParser = new JsonldParser()

export default {
  resources (state) {
    if (!state.resourceGraph) {
      return []
    }

    return state.resourceGraph['@graph'] || []
  },
  resourceIri () {
    return () => LdNavigator.resourceUrl
  },
  getDataset (state) {
    return async () => {
      const input = new Readable({
        read: () => {
          input.push(JSON.stringify(state.resourceGraph))
          input.push(null)
        }
      })

      const graph = rdf.dataset()
      const jsonldStream = jsonldParser.import(input)

      jsonldStream.on('data', (quad) => {
        graph.add(quad)
      })

      await rdf.waitFor(jsonldStream)
      return graph
    }
  },
  datasetContains (state, getters) {
    return async (id) => {
      const dataset = await getters.getDataset()

      return clownface(dataset).node(rdf.namedNode(id)).out().values.length > 0
    }
  }
}
