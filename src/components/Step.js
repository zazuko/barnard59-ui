import nodeLabel from '../utils/nodeLabel.js'
import ns from '../utils/namespaces.js'
import CodeForm from './CodeForm.js'
import Vue from 'vue/dist/vue.js'

export default Vue.component('step', {
  props: [
    'step'
  ],
  components: {
    CodeForm
  },
  data: function () {
    return {
      nodeLabel,
      ns
    }
  },
  methods: {
    label: function () {
      return nodeLabel(this.step)
    }
  },
  template: `
    <form v-if="step">
      <h1>{{ label() }}</h1>
      <h3>Operation</h3>
      <code-form v-bind:parent="step" v-bind:property="ns.code('implementedBy')"></code-form>
    </form>
  `
})
