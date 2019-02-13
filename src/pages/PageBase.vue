<script>
import LdNavigator from 'ld-navigation/LdNavigator'
import Container from 'bootstrap-vue/es/components/layout/container'

import 'ld-navigation/ld-navigator'
import * as config from '../config'

export default {
  components: {
    'b-container': Container
  },
  data () {
    return {
      baseUri: config.baseUrl
    }
  },
  mounted () {
    this.$el.querySelector('ld-navigator')
      .addEventListener('resource-url-changed', () => {
        this.$router.replace(`/${LdNavigator.statePath}`)
      })
  }
}
</script>
<template>
  <b-container fluid>
    <ld-navigator :base="baseUri"></ld-navigator>
    <slot></slot>
  </b-container>
</template>
