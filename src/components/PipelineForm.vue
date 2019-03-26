<script>
import BForm from 'bootstrap-vue/src/components/form/form'
import BFormGroup from 'bootstrap-vue/src/components/form-group/form-group'
import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers('pipeline')

export default {
  components: { BFormGroup, BForm },
  data () {
    return {
      slug: ''
    }
  },
  methods: {
    ...mapActions([

    ])
  }
}
</script>

<template>
  <b-form @submit.prevent="createPipeline(slug)">
    <b-form-group label="URI slug">
      <b-form-input required v-model="slug"></b-form-input>
    </b-form-group>
    <b-button type="submit" variant="primary">Add pipeline</b-button>
  </b-form>
</template>
