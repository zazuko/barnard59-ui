import ns from './namespaces'

function nodeLabel (node) {
  if (!node.term) {
    return null
  }

  const label = node.out(ns.rdf('label'))

  if (label.value) {
    return label.value
  }

  return node.value.split('#')[1]
}

export default nodeLabel
