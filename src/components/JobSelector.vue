<script>
import navigateTo from 'ld-navigation/fireNavigation'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selected: null
    }
  },
  computed: {
    ...mapState({
      jobs: state => state.jobs.items
    }),
    items () {
      return this.jobs.values()
    }
  },
  created () {
    this.$store.dispatch('fetchJobs')
  },
  watch: {
    selected () {
      const jobIri = this.jobs.get(this.selected).term

      navigateTo(jobIri.value)
    }
  }
}
</script>

<template>
  <select class="form-control" v-model="selected">
    <option v-for="job in items" :value="job.value" :key="job.value">
      {{ job.value }}
    </option>
  </select>
</template>
