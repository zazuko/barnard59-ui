const clownface = require('clownface')
const ns = require('barnard59-core/lib/namespaces')
const rdf = require('rdf-ext')
const rdfFetch = require('rdf-fetch')

class Client {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  create (iri, type) {
    const dataset = rdf.dataset()
    const node = clownface(dataset).node(null, { type: 'BlankNode' })

    node.addOut(ns.rdf('type'), rdf.namedNode(type.value || type))

    return rdfFetch((iri.value || iri).split('#')[0], {
      method: 'POST',
      body: dataset.toStream()
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(new Error(`http error: ${res.status}`))
      }

      return rdf.namedNode(res.headers.get('location'))
    })
  }

  fetch (iri) {
    return rdfFetch((iri.value || iri).split('#')[0]).then(res => {
      if (!res.ok) {
        return Promise.reject(new Error(`http error: ${res.status}`))
      }

      return res.dataset()
    }).then(dataset => {
      return clownface(dataset, rdf.namedNode(iri.toString()))
    })
  }

  update (node) {
    return rdfFetch(node.value.split('#')[0], {
      method: 'PUT',
      body: node.dataset.toStream()
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(new Error(`http error: ${res.status}`))
      }

      return node
    })
  }

  createPipeline () {
    return this.create(`${this.baseUrl}pipeline/`, ns.p('Pipeline'))
  }

  fetchPipelines () {
    return this.fetch(`${this.baseUrl}pipeline/`)
  }

  createJob (pipelineIri) {
    return this.create(`${this.baseUrl}job/`, ns.code('Run')).then(jobIri => {
      return this.fetch(jobIri)
    }).then(job => {
      job.addOut(ns.p('operation'), code => {
        code
          .addOut(ns.code('link'), pipelineIri)
          .addOut(ns.code('type'), ns.p('Pipeline'))
      })

      return this.update(job)
    })
  }

  fetchJobs () {
    return this.fetch(`${this.baseUrl}job/`)
  }
}

module.exports = Client
