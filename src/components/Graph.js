import Vue from 'vue/dist/vue.js'
import Readable from 'readable-stream'
import rdf from 'rdf-ext'
import JsonldParser from '@rdfjs/parser-jsonld'
import JsonldSerializer from '@rdfjs/serializer-jsonld'

const jsonldParser = new JsonldParser()
const jsonldSerializer = new JsonldSerializer()

export default Vue.component('graph', {
  props: [
    'graph',
    'dataset',
    'jsonLd',
    'context',
    'syntax'
  ],
  watch: {
    context: function () {
      this.update()
    },
    jsonLd: function () {
      this.update()
    },
    dataset: function () {
      if (this.syntax === 'json-ld') {
        const output = jsonldSerializer.import(this.dataset.toStream())

        output.on('data', jsonld => {
          this.graphStr = jsonld
        })
      } else {
        this.graphStr = this.dataset.toString()
      }
    }
  },
  data: function () {
    return {
      graphStr: ''
    }
  },
  methods: {
    update: async function () {
      if (!this.jsonLd) return

      const jsonLd = {
        '@context': this.context,
        ...this.jsonLd
      }

      if (this.syntax === 'json-ld') {
        this.graphStr = JSON.stringify(jsonLd, null, 2)
        return
      }

      const input = new Readable({
        read: () => {
          input.push(JSON.stringify(jsonLd))
          input.push(null)
        }
      })

      const graph = rdf.dataset()
      const jsonldStream = jsonldParser.import(input)

      jsonldStream.on('data', (quad) => {
        graph.add(quad)
      })

      rdf.waitFor(jsonldStream)
        .then(() => {
          this.dataset = graph
        })
    }
  },
  template: `
    <form v-if="graphStr">
      <div class="form-group">
        <textarea class="form-control" rows="20"><textarea readonly>{{ graphStr }}</textarea></textarea>
      </div>
    </form>
  `
})
