<script>
import Job from '../components/Job.vue'
import Navigation from '../components/Navigation.vue'
import PageBase from './PageBase.vue'
import store from '../store'
import LdNavigator from 'ld-navigation/LdNavigator'
import { mapGetters } from 'vuex'

export default {
  store,
  components: {
    Job,
    Navigation,
    PageBase
  },
  computed: {
    resourceIri () {
      return LdNavigator.resourceUrl
    },
    ...mapGetters({
      client: 'client'
    })
  }
}
</script>

<template>
  <page-base>
    <template>
      <navigation :job-iri="$store.state.resourceIri"></navigation>
      <job :client="client" :job-iri="resourceIri"></job>
    </template>
  </page-base>
</template>
