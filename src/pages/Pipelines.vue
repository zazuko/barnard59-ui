<script>
import Navigation from '../components/Navigation.vue'
import PipelineSelector from '../components/PipelineSelector.vue'
import PipelineForm from '../components/PipelineForm.vue'
import store from '../store'
import PageBase from './PageBase.vue'

export default {
  components: {
    PageBase,
    Navigation,
    PipelineSelector,
    PipelineForm
  },
  store
}
</script>

<template>
  <page-base>
    <navigation></navigation>
    <h2>Pipeline</h2>
    <pipeline-selector></pipeline-selector>
    <pipeline-form></pipeline-form>
  </page-base>
</template>
