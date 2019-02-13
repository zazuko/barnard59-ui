import Vue from 'vue/dist/vue.js'
import navigateTo from 'ld-navigation/fireNavigation'
import { mapState } from 'vuex'

export default Vue.component('job-selector', {
  data: function () {
    return {
      selected: null
    }
  },
  computed: mapState({
    jobs: state => state.jobs.items
  }),
  created: function () {
    this.$store.dispatch('fetchJobs')
  },
  watch: {
    selected: function () {
      const jobIri = this.jobs.get(this.selected).term

      navigateTo(jobIri.value)
    }
  },
  template: `
    <select class="form-control" v-model="selected">
      <option v-for="job in [...jobs.values()]" v-bind:value="job.value">
        {{ job.value }}
      </option>
    </select>
  `
})
