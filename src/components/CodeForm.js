import ns from '../utils/namespaces.js'
import Vue from 'vue/dist/vue.js'

const types = [{
  id: 'ecmaScript - NamedNode',
  label: 'ECMAScript',
  term: ns.code('ecmaScript')
}, {
  id: 'ecmaScript - Literal',
  label: 'ECMAScript (inline)',
  term: ns.code('ecmaScript'),
  literal: true
}, {
  id: 'ecmaScriptTemplateLiteral - Literal',
  label: 'ECMAScript Template Literal',
  term: ns.code('ecmaScriptTemplateLiteral'),
  literal: true
}, {
  id: 'Pipeline - NamedNode',
  label: 'Pipeline',
  term: ns.p('Pipeline')
}]

export default Vue.component('code-form', {
  props: [
    'parent',
    'property'
  ],
  components: {
  },
  data: function () {
    return {
      node: null,
      types
    }
  },
  created: function () {
    this.updateNode()
  },
  computed: {
    type: {
      get: function () {
        if (!this.node) {
          return null
        }

        const term = this.node.term.datatype || this.node.out(ns.code('type')).term
        const isLiteral = this.node.term.termType === 'Literal'

        const type = types.filter(type => type.term.equals(term) && Boolean(type.literal) === isLiteral)[0]

        return type
      },
      set: function (type) {
        this.updateCode(type.term, type.literal, null)
      }
    },
    value: {
      get: function () {
        if (!this.node) {
          return null
        }

        const valueNode = this.node.term.termType === 'Literal' ? this.node : this.node.out(ns.code('link'))

        return valueNode && valueNode.term && valueNode.term.value
      },
      set: function (value) {
        if (!this.node || !this.node.term) {
          return null
        }

        this.updateCode(null, null, value)
      }
    }
  },
  watch: {
    parent: function () {
      this.updateNode()
    }
  },
  methods: {
    updateNode: function () {
      this.node = this.parent.out(this.property)

      if (!this.node.term) {
        this.node = null
      }
    },
    updateCode: function (term, literal, value) {
      if (!term && this.node) {
        term = this.node.term.datatype || this.node.out(ns.code('type')).term
      }

      if (literal === null && this.node) {
        literal = this.node.term.termType === 'Literal'
      }

      if (value === null) {
        value = this.value
      }

      // delete existing code
      if (this.node) {
        this.node.deleteOut()
      }

      this.parent.deleteOut(this.property)

      // add new code
      if (literal) {
        this.parent.addOut(this.property, this.parent.node(value || '0', { datatype: term }))
      } else {
        this.parent.addOut(this.property, code => {
          code.addOut(ns.code('type'), term)

          if (value) {
            code.addOut(ns.code('link'), this.parent.node(value, { type: 'NamedNode' }))
          }
        })
      }

      this.updateNode()
    }
  },
  template: `
    <form v-if="node">
      <div class="form-group">
        <label for="">type</label>
        <select class="form-control" v-model="type">
          <option v-for="type in types" v-bind:value="type">
            {{ type.label }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="">code</label>
        <input type="text" class="form-control" id="" v-model="value" v-if="!type.literal">
        <textarea class="form-control" rows="20" v-model="value" v-if="type.literal">{{ value }}</textarea>
      </div>
    </form>
  `
})
