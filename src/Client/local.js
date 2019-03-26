import clownface from 'clownface'
import rdf from 'rdf-ext'
import JsonldParser from '@rdfjs/parser-jsonld'
import Readable from 'readable-stream'

const jsonldParser = new JsonldParser()

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

  save (graph) {
    localStorage.setItem(graph['@context']['@base'], JSON.stringify(graph))
  }
}
