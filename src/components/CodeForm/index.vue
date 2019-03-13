<script>
import Form from 'bootstrap-vue/es/components/form/form'
import FormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import Select from 'bootstrap-vue/es/components/form-select/form-select'
import ImplementedByPipeline from './Pipeline.vue'
import ImplementedByEcmascript from './EcmaScript.vue'
import ImplementedByEcmascriptLiteral from './EcmaScriptLiteral.vue'
import ImplementedByTemplateLiteral from './EcmaScriptTemplateLiteral.vue'

// Vue.use(Forms)

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

export default {
  props: [
    'operation'
  ],
  components: {
    'b-form': Form,
    'b-select': Select,
    'b-form-group': FormGroup,
    ImplementedByEcmascript,
    ImplementedByPipeline,
    ImplementedByEcmascriptLiteral,
    ImplementedByTemplateLiteral
  },
  data () {
    return {
      types,
      type: null
    }
  },
  created () {
    if (!this.operation['code:implementedBy']) {
      return
    }

    const operationType = this.operation['code:implementedBy']['@type']
    const isLiteral = !!this.operation['code:implementedBy']['@value']

    const type = types.find(type => type.value.term === operationType && type.value.literal === isLiteral)

    console.log(type)
    if (type) {
      this.type = type.value
    }
  },
  computed: {
    implementation () {
      return { ...this.operation['code:implementedBy'] }
    }
  },
  watch: {
    operation () {
      const operationType = this.operation['code:implementedBy']['@type']
      const isLiteral = !!this.operation['code:implementedBy']['@value']

      this.type = types.filter(type => type.value.term === operationType && type.value.literal === isLiteral)[0].value
    },
    type () {
      if (this.type) {
        this.implementation['@type'] = this.type.term
      }
    }
  }
}
</script>

<template>
  <b-form>
    <b-form-group label="type">
      <b-select :options="types" v-model="type" text-field="label"></b-select>
    </b-form-group>
    <b-form-group label="code" v-if="type">
      <component :is="type.component" v-bind="{ implementation }"></component>
    </b-form-group>
  </b-form>
</template>
