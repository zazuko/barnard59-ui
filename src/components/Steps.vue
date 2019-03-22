<script>
import Button from 'bootstrap-vue/es/components/button/button'
import { createNamespacedHelpers } from 'vuex'
import { addStep, selectStep, deleteStep } from '../store/pipeline/action-types'
import { getLabel } from '../utils/uri-helpers'

const { mapGetters, mapActions } = createNamespacedHelpers('pipeline')

export default {
  computed: mapGetters({
    steps: 'steps',
    pipelineBaseIri: 'baseUrl'
  }),
  components: {
    'b-button': Button
  },
  methods: {
    ...mapActions({
      add: addStep,
      remove: deleteStep,
      select: selectStep
    }),
    getLabel
  }
}
</script>

<template>
  <table class="table">
    <tr>
      <td></td>
      <td><b-button variant="success" @click="add(0)">+</b-button></td>
    </tr>

    <tr v-for="(step, index) in steps" :key="step.id">
      <td><a href="javascript:void(0)" @click="select(step)">{{ step.label || getLabel(pipelineBaseIri, step.id) }}</a></td>
      <td>
        <b-button variant="success" @click="add(index + 1)">+</b-button>
        <b-button variant="danger" @click="remove(index)">-</b-button>
      </td>
    </tr>
  </table>
</template>
