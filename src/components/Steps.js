import nodeLabel from '../utils/nodeLabel.js'
import Vue from 'vue/dist/vue.js'

export default Vue.component('steps', {
  props: [
    'baseUrl',
    'steps'
  ],
  components: {
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
          <td><button class="btn btn-success" v-on:click="add(0)">+</button></td>
        </tr>
        
        <tr v-for="(step, index) in steps">
          <td><a href="javascript:void(0)" v-on:click="$emit('input', step)">{{step.label || step.id}}</a></td>
          <td>
            <button class="btn btn-success" v-on:click="add(index + 1)">+</button>
            <button class="btn btn-danger" v-on:click="remove(index)">-</button>
          </td>
        </tr>
      </table>
  `
})
