<script>
import BForm from 'bootstrap-vue/src/components/form/form'
import BFormGroup from 'bootstrap-vue/src/components/form-group/form-group'
import BFormInput from 'bootstrap-vue/src/components/form-input/form-input'
import { mapActions } from 'vuex'
import BButton from 'bootstrap-vue/src/components/button/button'
import * as actions from '../store/root/action-types'

export default {
  components: { BButton, BFormInput, BFormGroup, BForm },
  methods: {
    ...mapActions([actions.SAVE_SETTINGS]),
    saveAndReload () {
      this.saveSettings(this.settings)
      this.$store.dispatch('fetchPipelines')
      this.$store.dispatch('fetchJobs')
    }
  },
  data () {
    return {
      settings: {
        baseUrl: this.$store.state.config.baseUrl
      }
    }
  }
}
</script>

<template>
  <b-form @submit.prevent="saveAndReload">
    <b-form-group label="Resource base">
      <b-form-input v-model="settings.baseUrl" required></b-form-input>
    </b-form-group>
    <b-button type="submit" variant="primary">Save</b-button>
  </b-form>
</template>
