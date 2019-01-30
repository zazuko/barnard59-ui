import Vue from 'vue/dist/vue.js'
import Forms from 'bootstrap-vue/es/components/form'
import FormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import Select from 'bootstrap-vue/es/components/form-select/form-select'
import './Pipeline'
import './EcmaScript'
import './EcmaScriptLiteral'
import './EcmaScriptTemplateLiteral'

Vue.use(Forms)

const types = [{
  label: 'ECMAScript',
  value: {
    term: 'code:EcmaScript',
    component: 'implemented-by-ecmascript'
  }
}, {
  label: 'ECMAScript (inline)',
  value: {
    term: 'code:EcmaScript',
    component: 'implemented-by-ecmascript-literal',
    literal: true
  }
}, {
  label: 'ECMAScript Template Literal',
  value: {
    term: 'code:EcmaScriptTemplateLiteral',
    component: 'implemented-by-template-literal',
    literal: true
  }
}, {
  label: 'Pipeline',
  value: {
    term: 'p:Pipeline',
    component: 'implemented-by-pipeline'
  }
}]

export default Vue.component('code-form', {
  props: [
    'operation'
  ],
  components: {
    'b-select': Select,
    'b-form-group': FormGroup
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

    this.type = types.filter(type => type.value.term === operationType && (type.literal ? type.literal === isLiteral : true))[0].value
  },
  computed: {
    implementationForm: function () {
      const type = types.find(t => t.value.term === this.type.term && t.value.literal === this.type.literal)
      return type ? type.value.component : null
    }
  },
  watch: {
    operation: function () {
      const operationType = this.operation['code:implementedBy']['@type']
      const isLiteral = !!this.operation['code:implementedBy']['@value']

      this.type = types.filter(type => type.term === operationType && type.literal === isLiteral)[0].value
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
    <b-form>
      <b-form-group label="type">
        <b-select :options="types" v-model="type" text-field="label"></b-select>
      </b-form-group>
      <b-form-group label="code">
        <component v-bind:is="implementationForm" v-bind:implementation="operation['code:implementedBy']"></component>
      </b-form-group>
    </b-form>
  `
})
