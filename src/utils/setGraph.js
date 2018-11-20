const rdf = require('rdf-ext')

function setGraph (dataset, graph) {
  return dataset.map(quad => {
    return rdf.quad(quad.subject, quad.predicate, quad.object, graph)
  })
}

module.exports = setGraph
