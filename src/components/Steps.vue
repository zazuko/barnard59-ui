<script>
import Button from 'bootstrap-vue/es/components/button/button'
import { createNamespacedHelpers } from 'vuex'
import { addStep, selectStep, deleteStep } from '../store/pipeline/action-types'
import BFormInput from 'bootstrap-vue/src/components/form-input/form-input'

const { mapGetters, mapActions } = createNamespacedHelpers('pipeline')

export default {
  computed: mapGetters({
    steps: 'steps'
  }),
  components: {
    BFormInput,
    'b-button': Button
  },
  methods: {
    ...mapActions({
      addStep,
      remove: deleteStep,
      select: selectStep
    }),
    add (name) {
      if (name) {
        this.addStep(name).catch(e => this.$toasted.show(e.message).goAway(1000))
      } else {
        this.$refs.newStepSlugInput.reportValidity()
      }
    }
  },
  data () {
    return {
      newStepSlug: ''
    }
  }
}
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <td>
          <b-form-input
            ref="newStepSlugInput"
            v-model="newStepSlug"
            placeholder="Step ID slug"
            required></b-form-input>
        </td>
        <td><b-button variant="success" @click="add(newStepSlug)">+</b-button></td>
      </tr>
    </thead>

    <tr v-for="(step, index) in steps" :key="step.id">
      <td><a href="javascript:void(0)" @click="select(step)">{{ step.label || step.id }}</a></td>
      <td>
        <b-button variant="danger" @click="remove(index)">-</b-button>
      </td>
    </tr>
  </table>
</template>
