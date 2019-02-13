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
    component: 'implemented-by-ecmascript',
    literal: false
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
    component: 'implemented-by-pipeline',
    literal: false
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
      types,
      type: null
    }
  },
  created: function () {
    const operationType = this.operation['code:implementedBy']['@type']
    const isLiteral = !!this.operation['code:implementedBy']['@value']

    this.type = types.filter(type => type.value.term === operationType && type.value.literal === isLiteral)[0].value
  },
  computed: {
    implementation: function () {
      return { ...this.operation['code:implementedBy'] }
    }
  },
  watch: {
    operation: function () {
      const operationType = this.operation['code:implementedBy']['@type']
      const isLiteral = !!this.operation['code:implementedBy']['@value']

      this.type = types.filter(type => type.value.term === operationType && type.value.literal === isLiteral)[0].value
    },
    type: function () {
      if (this.type) {
        this.implementation['@type'] = this.type.term
      }
    }
  },
  template: `
    <b-form>
      <b-form-group label="type">
        <b-select :options="types" v-model="type" text-field="label"></b-select>
      </b-form-group>
      <b-form-group label="code" v-if="type">
        <component v-bind:is="type.component" v-bind="{ implementation }"></component>
      </b-form-group>      
    </b-form>
  `
})
