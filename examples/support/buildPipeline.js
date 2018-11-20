const cf = require('clownface')
const namespace = require('@rdfjs/namespace')
const ns = require('barnard59-core/lib/namespaces')
const rdf = require('rdf-ext')

function buildPipeline (baseUrl) {
  const base = namespace(`${baseUrl.toString()}#`)
  const dataset = rdf.dataset()
  const root = base('pipeline')
  const def = cf.dataset(dataset, root)

  def
    .addOut(ns.rdf('type'), ns.p('Pipeline'))
    .addOut(ns.p('variables'), variables => {
      variables
        .addOut(ns.p('variable'), filename => {
          filename
            .addOut(ns.p('name'), 'filename')
            .addOut(ns.p('value'), 'test.csv')
        })
    })
    .addOut(ns.p('steps'), steps => {
      steps.addList(ns.p('stepList'), [
        def.node(base('readFile'))
          .addOut(ns.p('operation'), code => {
            code
              .addOut(ns.code('link'), def.node('node:fs#createReadStream', { type: 'NamedNode' }))
              .addOut(ns.code('type'), ns.code('ecmaScript'))
          })
          .addList(ns.p('arguments'), [
            def.node('${filename}', { datatype: ns.code('ecmaScriptTemplateLiteral') }) // eslint-disable-line no-template-curly-in-string
          ])
      ])
    })

  return {
    node: def,
    root,
    dataset
  }
}

module.exports = buildPipeline
