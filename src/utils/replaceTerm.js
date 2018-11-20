const rdf = require('rdf-ext')

function replaceTerm (dataset, current, replacement) {
  return dataset.map(quad => {
    return rdf.quad(
      quad.subject.equals(current) ? replacement : quad.subject,
      quad.predicate.equals(current) ? replacement : quad.predicate,
      quad.object.equals(current) ? replacement : quad.object,
      quad.graph.equals(current) ? replacement : quad.graph
    )
  })
}

module.exports = replaceTerm
