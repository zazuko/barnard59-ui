import Vue from 'vue/dist/vue'
import LdNavigator from 'ld-navigation/LdNavigator'
import Container from 'bootstrap-vue/es/components/layout/container'

import 'ld-navigation/ld-navigator'
import * as config from '../config'

export default Vue.component('PageBase', {
  components: {
    'b-container': Container
  },
  data: function () {
    return {
      baseUri: config.baseUrl
    }
  },
  mounted: function () {
    this.$el.querySelector('ld-navigator')
      .addEventListener('resource-url-changed', () => {
        this.$router.replace(`/${LdNavigator.statePath}`)
      })
  },
  template: `
    <b-container fluid>
      <ld-navigator v-bind:base="baseUri"></ld-navigator>
      <slot></slot>
    </b-container>
  `
})
