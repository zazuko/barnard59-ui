const clownface = require('clownface').dataset
const express = require('express')
const namespace = require('@rdfjs/namespace')
const pageRank = require('../utils/pageRank')
const rdf = require('rdf-ext')
const replaceTerm = require('../utils/replaceTerm')
const setGraph = require('../utils/setGraph')

const schema = namespace('http://schema.org/')

class Container {
  constructor (store, iri) {
    this.store = store
    this.iri = rdf.namedNode(iri.toString())
    this.router = new express.Router()
    this.count = 0

    this.router.get('/', this.getContainer.bind(this))
    this.router.get('/:resource', this.getResource.bind(this))
    this.router.post('/', this.postContainer.bind(this))
    this.router.put('/:resource', this.putResource.bind(this))
  }

  addToContainer (contentNode) {
    const container = rdf.dataset()
    const containerNode = clownface(container, this.iri)

    containerNode.addOut(schema('hasPart'), contentNode)

    return rdf.waitFor(this.store.import(setGraph(container, this.iri).toStream()))
  }

  add (contentNode) {
    const graph = rdf.namedNode(contentNode.value.split('#')[0])

    return Promise.all([
      rdf.waitFor(this.store.import(setGraph(contentNode.dataset, graph).toStream())),
      this.addToContainer(contentNode)
    ])
  }

  update (contentNode) {
    return rdf.waitFor(this.store.removeMatches(null, null, null, contentNode.term)).then(() => {
      return rdf.waitFor(this.store.import(setGraph(contentNode.dataset, contentNode.term).toStream()))
    })
  }

  getContainer (req, res, next) {
    return this.getResource(req, res, next)
  }

  getResource (req, res, next) {
    const iri = rdf.namedNode(req.absoluteUrl())

    return rdf.dataset().import(this.store.match(null, null, null, iri)).then(dataset => {
      if (dataset.length === 0) {
        return next()
      }

      res.graph(rdf.graph(dataset))
    })
  }

  postContainer (req, res, next) {
    const dataset = req.graph

    if (dataset.length === 0) {
      return next()
    }

    const tempRoot = pageRank(dataset)[0].node
    const newRoot = rdf.namedNode(`${this.iri}${++this.count}`) // TODO
    const patched = replaceTerm(dataset, tempRoot, newRoot)

    const contentNode = clownface(patched, newRoot)

    this.add(contentNode)

    res.status(201).set('location', newRoot.value).end()
  }

  putResource (req, res, next) {
    const dataset = req.graph
    const graph = rdf.namedNode(req.absoluteUrl())

    const contentNode = clownface(dataset, graph)

    return this.update(contentNode).then(() => {
      res.status(201).end()
    })
  }
}

module.exports = Container
