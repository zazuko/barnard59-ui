import Vue from 'vue/dist/vue.js'

export default Vue.component('graph', {
  props: [
    'graph'
  ],
  components: {
  },
  data: function () {
    return {}
  },
  methods: {
  },
  template: `
    <form v-if="graph">
      <div class="form-group">
        <textarea class="form-control" rows="20"><textarea>{{ graph && graph.toString() }}</textarea></textarea>
      </div>
    </form>
  `
})
