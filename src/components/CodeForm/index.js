import ns from '../../utils/namespaces.js'
import Vue from 'vue/dist/vue.js'
import './Pipeline'
import './EcmaScript'
import './EcmaScriptLiteral'
import './EcmaScriptTemplateLiteral'

const types = [{
  id: 'ecmaScript - NamedNode',
  label: 'ECMAScript',
  term: 'code:EcmaScript',
  component: 'implemented-by-ecmascript'
}, {
  id: 'ecmaScript - Literal',
  label: 'ECMAScript (inline)',
  term: 'code:EcmaScript',
  component: 'implemented-by-ecmascript-literal',
  literal: true
}, {
  id: 'ecmaScriptTemplateLiteral - Literal',
  label: 'ECMAScript Template Literal',
  term: 'code:EcmaScriptTemplateLiteral',
  component: 'implemented-by-template-literal',
  literal: true
}, {
  id: 'Pipeline - NamedNode',
  label: 'Pipeline',
  term: ns.p('Pipeline').value,
  component: 'implemented-by-pipeline'
}]

export default Vue.component('code-form', {
  props: [
    'operation'
  ],
  components: {
  },
  data: function () {
    return {
      node: null,
      types,
      type: {}
    }
  },
  created: function () {
    const operationType = this.operation['code:implementedBy']['@type']
    const isLiteral = !!this.operation['code:implementedBy']['@value']

    this.type = types.filter(type => type.term === operationType && (type.literal ? type.literal === isLiteral : true))[0]
  },
  computed: {
    implementationForm: function () {
      const type = types.find(t => t.term === this.type.term && t.literal === this.type.literal)
      return type ? type.component : null
    }
  },
  watch: {
    operation: function () {
      const operationType = this.operation['code:implementedBy']['@type']
      const isLiteral = !!this.operation['code:implementedBy']['@value']

      this.type = types.filter(type => type.term === operationType && type.literal === isLiteral)[0]
    },
    type: function () {
      const previous = this.operation['code:implementedBy']

      this.operation['code:implementedBy'] = {
        '@type': this.type.term
      }

      if (this.type.literal) {
        this.operation['code:implementedBy']['@value'] = previous['@value']
      } else {
        this.operation['code:implementedBy']['code:link'] = previous['code:link']
      }
    }
  },
  template: `
    <form>
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
        <component v-bind:is="implementationForm" v-bind:implementation="operation['code:implementedBy']"></component>
      </div>
    </form>
  `
})
