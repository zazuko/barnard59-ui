<script>
import JobSelector from '../components/JobSelector.vue'
import Navigation from '../components/Navigation.vue'
import PageBase from './PageBase.vue'
import store from '../store'

export default {
  store,
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
    <h2>Job</h2>
    <job-selector></job-selector>
  </page-base>
</template>
