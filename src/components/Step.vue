<script>
import CodeForm from './CodeForm/index.vue'
import ArgumentForm from './ArgumentForm.vue'
import Tabs from 'bootstrap-vue/es/components/tabs/tabs'
import Tab from 'bootstrap-vue/es/components/tabs/tab'
import Button from 'bootstrap-vue/es/components/button/button'
import { createNamespacedHelpers } from 'vuex'

const { mapActions, mapState } = createNamespacedHelpers('pipeline')

export default {
  data: () => ({
    implementation: {},
    arguments: []
  }),
  computed: mapState({
    step: 'selectedStep'
  }),
  components: {
    ArgumentForm,
    CodeForm,
    'b-tabs': Tabs,
    'b-tab': Tab,
    'b-button': Button
  },
  methods: {
    ...mapActions({
      save: 'updateStep'
    }),
    getStep () {
      const implementation = this.$refs.code.implementation

      // temp trick while code:EcmaScript acts both as datatype and Class
      if (this.$refs.code.type.literal) {
        delete implementation['code:link']
      } else {
        delete implementation['@value']
      }

      return {
        id: this.step.id,
        'code:implementedBy': implementation,
        'code:arguments': this.$refs.argForm.stepArguments
      }
    }
  }
}
</script>
<template>
  <form v-if="step">
    <h1>{{ step.label || step.id }}</h1>
    <b-button variant="primary" @click="save(getStep())">Save</b-button>
    <b-tabs>
      <b-tab title="Operation">
        <code-form :operation="step" ref="code"></code-form>
      </b-tab>
      <b-tab title="Arguments">
        <argument-form :step="step" ref="argForm"></argument-form>
      </b-tab>
    </b-tabs>
  </form>
</template>
