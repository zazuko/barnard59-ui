<script>
import Navigation from '../components/Navigation.vue'
import Pipeline from '../components/Pipeline.vue'
import PageBase from './PageBase.vue'
import store from '../store'

export default {
  components: {
    Navigation,
    Pipeline,
    PageBase
  },
  store
}
</script>

<template>
  <page-base>
    <template>
      <navigation :pipeline-iri="$store.getters.resourceIri()"></navigation>
      <pipeline></pipeline>
    </template>
  </page-base>
</template>
