import CodeForm from './CodeForm'
import Vue from 'vue/dist/vue.js'

export default Vue.component('step', {
  props: [
    'step'
  ],
  components: {
    CodeForm
  },
  template: `
    <form v-if="step">
      <h1>{{ step.label || step.id }}</h1>
      <h3>Operation</h3>
      <code-form v-bind:operation="step"></code-form>
    </form>
  `
})
