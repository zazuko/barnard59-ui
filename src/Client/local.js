export default class LocalStorageClient {
  load (iri) {
    return JSON.parse(localStorage.getItem(iri))
  }

  save (iri, graph) {
    localStorage.setItem(iri, JSON.stringify(graph))
  }

  delete (iri) {
    localStorage.removeItem(iri)
  }
}
