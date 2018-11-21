const clownface = require('clownface')
const ns = require('../utils/namespaces')
const rdf = require('rdf-ext')
const Container = require('./Container')

class Pipelines extends Container {
  getContainer (req, res, next) {
    const iri = rdf.namedNode(req.absoluteUrl())

    return rdf.dataset().import(this.store.match(null, ns.rdf('type'), ns.p('Pipeline'))).then(dataset => {
      if (dataset.length === 0) {
        return next()
      }

      const container = rdf.dataset()
      const containerNode = clownface(container, iri)

      dataset.forEach(quad => {
        containerNode.addOut(ns.schema('hasPart'), quad.subject)
      })

      res.graph(rdf.graph(container))
    })
  }
}

module.exports = Pipelines
