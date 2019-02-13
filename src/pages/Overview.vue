<script>
import store from '../store'
import JobSelector from '../components/JobSelector.vue'
import Navigation from '../components/Navigation.vue'
import PipelineSelector from '../components/PipelineSelector.vue'
import PageBase from './PageBase.vue'

export default {
  components: {
    PageBase,
    JobSelector,
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
    <h1>Job</h1>
    <job-selector></job-selector>
  </page-base>
</template>
