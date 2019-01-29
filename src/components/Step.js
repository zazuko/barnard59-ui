import CodeForm from './CodeForm'
import ArgumentForm from './ArgumentForm'
import Vue from 'vue/dist/vue.js'
import Tabs from 'bootstrap-vue/es/components/tabs/tabs'
import Tab from 'bootstrap-vue/es/components/tabs/tab'

export default Vue.component('step', {
  props: [
    'step'
  ],
  components: {
    ArgumentForm,
    CodeForm,
    'b-tabs': Tabs,
    'b-tab': Tab
  },
  template: `
    <form v-if="step">
      <h1>{{ step.label || step.id }}</h1>
      <b-tabs>
        <b-tab title="Operation">
          <code-form v-bind:operation="step"></code-form>
        </b-tab>
        <b-tab title="Arguments">
          <argument-form v-bind:step="step"></argument-form>
        </b-tab>
      </b-tabs>
    </form>
  `
})
