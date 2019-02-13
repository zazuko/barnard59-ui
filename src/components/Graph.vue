<script>
import Readable from 'readable-stream'
import rdf from 'rdf-ext'
import JsonldParser from '@rdfjs/parser-jsonld'
import JsonldSerializer from '@rdfjs/serializer-jsonld'

const jsonldParser = new JsonldParser()
const jsonldSerializer = new JsonldSerializer()

export default {
  props: [
    'graph',
    'jsonLd',
    'context',
    'syntax'
  ],
  watch: {
    context () {
      this.update()
    },
    jsonLd: {
      handler () {
        this.update()
      },
      deep: true
    },
    graph () {
      if (this.graph.dataset) {
        this.dataset = this.graph.dataset
      }
    },
    dataset () {
      if (this.syntax === 'json-ld') {
        const output = jsonldSerializer.import(this.dataset.toStream())

        output.on('data', jsonld => {
          this.graphStr = jsonld
        })
      }
      else {
        this.graphStr = this.dataset.toString()
      }
    }
  },
  data () {
    return {
      graphStr: '',
      dataset: {}
    }
  },
  methods: {
    async update () {
      if (!this.jsonLd) {
        return
      }

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
  }
}
</script>

<template>
  <form v-if="graphStr">
    <div class="form-group">
      <textarea class="form-control" rows="20" readonly :value="graphStr"></textarea>
    </div>
  </form>
</template>
