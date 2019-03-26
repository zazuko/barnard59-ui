<script>
import store from '../store'
import JobSelector from '../components/JobSelector.vue'
import Navigation from '../components/Navigation.vue'
import PipelineSelector from '../components/PipelineSelector.vue'
import PageBase from './PageBase.vue'
import UiSettings from './UiSettings.vue'

export default {
  components: {
    PageBase,
    JobSelector,
    Navigation,
    PipelineSelector,
    UiSettings
  },
  store
}
</script>

<template>
  <page-base>
    <navigation></navigation>
    <h2>Pipeline</h2>
    <pipeline-selector></pipeline-selector>
    <h2>Job</h2>
    <job-selector></job-selector>
    <h2>Settings</h2>
    <ui-settings></ui-settings>
  </page-base>
</template>
