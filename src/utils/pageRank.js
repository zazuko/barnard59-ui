const pageRankJs = require('pagerank.js')

function pageRank (dataset, alpha = 0.85, epsilon = 0.000001) {
  pageRankJs.reset()

  const nodes = new Map()

  dataset.forEach(quad => {
    const subjectId = quad.subject.toCanonical()
    const objectId = quad.object.toCanonical()

    nodes.set(subjectId, quad.subject)
    nodes.set(objectId, quad.object)

    pageRankJs.link(subjectId, objectId, 1)
  })

  const result = []

  pageRankJs.rank(alpha, epsilon, (node, rank) => {
    result.push({
      node: nodes.get(node),
      rank
    })
  })

  return result.sort((a, b) => a.rank - b.rank)
}

module.exports = pageRank
