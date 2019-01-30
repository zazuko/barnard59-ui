import nodeLabel from '../utils/nodeLabel.js'
import Vue from 'vue/dist/vue.js'
import Button from 'bootstrap-vue/es/components/button/button'

export default Vue.component('steps', {
  props: [
    'baseUrl',
    'steps'
  ],
  components: {
    'b-button': Button
  },
  data: function () {
    return {
      nodeLabel
    }
  },
  methods: {
    add: function (index) {
      this.$emit('step-added', index)
    },
    remove: function (index) {
      this.$emit('step-deleted', index)
    },
    selected: function (step) {
      this.$emit('step-click', step)
    }
  },
  template: `
      <table class="table">
        <tr>
          <td></td>
          <td><b-button variant="success" v-on:click="add(0)">+</b-button></td>
        </tr>
        
        <tr v-for="(step, index) in steps">
          <td><a href="javascript:void(0)" v-on:click="$emit('input', step)">{{step.label || step.id}}</a></td>
          <td>
            <b-button variant="success" v-on:click="add(index + 1)">+</b-button>
            <b-button variant="danger" v-on:click="remove(index)">-</b-button>
          </td>
        </tr>
      </table>
  `
})
