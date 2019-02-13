<script>
import JobSelector from '../components/JobSelector.vue'
import Navigation from '../components/Navigation.vue'
import PageBase from './PageBase.vue'

export default {
  components: {
    JobSelector,
    Navigation,
    PageBase
  }
}
</script>

<template>
  <page-base>
    <navigation></navigation>
    <h1>Job</h1>
    <job-selector></job-selector>
  </page-base>
</template>
