import Vue from 'vue/dist/vue.js'
import Button from 'bootstrap-vue/es/components/button/button'
import { createNamespacedHelpers } from 'vuex'
import { addStep, selectStep, deleteStep } from '../store/pipeline-actions'

const { mapGetters, mapActions } = createNamespacedHelpers('pipeline')

export default Vue.component('steps', {
  computed: mapGetters({
    steps: 'steps'
  }),
  components: {
    'b-button': Button
  },
  methods: {
    ...mapActions({
      add: addStep,
      remove: deleteStep,
      select: selectStep
    })
  },
  template: `
      <table class="table">
        <tr>
          <td></td>
          <td><b-button variant="success" v-on:click="add(0)">+</b-button></td>
        </tr>
        
        <tr v-for="(step, index) in steps">
          <td><a href="javascript:void(0)" v-on:click="select(step)">{{step.label || step.id}}</a></td>
          <td>
            <b-button variant="success" v-on:click="add(index + 1)">+</b-button>
            <b-button variant="danger" v-on:click="remove(index)">-</b-button>
          </td>
        </tr>
      </table>
  `
})
