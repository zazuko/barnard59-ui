import Vue from 'vue/dist/vue'
import LdNavigator from 'ld-navigation/LdNavigator'

import 'ld-navigation/ld-navigator'
import * as config from '../config'

LdNavigator.base = config.baseUrl

export default Vue.component('PageBase', {
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
  computed: {
    resourceIri: () => {
      return LdNavigator.resourceUrl
    }
  },
  template: `
    <div>
      <ld-navigator v-bind:base="baseUri"></ld-navigator>
      <slot v-bind:resource-iri="resourceIri"></slot>
    </div>
  `
})
