<script>
import Navigation from '../components/Navigation.vue'
import PipelineSelector from '../components/PipelineSelector.vue'
import store from '../store'
import PageBase from './PageBase.vue'

export default {
  components: {
    PageBase,
    Navigation,
    PipelineSelector
  },
  store
}
</script>

<template>
  <page-base>
    <navigation></navigation>
    <h1>Pipeline</h1>
    <pipeline-selector></pipeline-selector>
  </page-base>
</template>
