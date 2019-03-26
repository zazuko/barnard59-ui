import clownface from 'clownface'
import rdf from 'rdf-ext'
import JsonldParser from '@rdfjs/parser-jsonld'
import Readable from 'readable-stream'
import JsonldSerializer from '@rdfjs/serializer-jsonld'

const jsonldParser = new JsonldParser()
const jsonldSerializer = new JsonldSerializer()

export default class LocalStorageClient {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  async fetch (iri) {
    const jsonLd = localStorage.getItem(iri.slice(0, iri.indexOf('#')))

    if (!jsonLd) {
      return null
    }

    const input = new Readable({
      read: () => {
        input.push(jsonLd)
        input.push(null)
      }
    })

    const graph = rdf.dataset()
    const jsonldStream = jsonldParser.import(input)

    jsonldStream.on('data', (quad) => {
      graph.add(quad)
    })

    await rdf.waitFor(jsonldStream)
    return clownface(graph)
  }

  update (node) {
    const iri = node.value.slice(0, node.value.indexOf('#'))
    const output = jsonldSerializer.import(node.dataset.toStream())

    return new Promise(resolve => {
      output.on('data', jsonld => {
        localStorage.setItem(iri, JSON.stringify(jsonld))

        resolve(node)
      })
    })
  }

  fetchJobs () {
    return clownface(rdf.dataset())
  }

  fetchPipelines () {
    return clownface(rdf.dataset())
  }
}
