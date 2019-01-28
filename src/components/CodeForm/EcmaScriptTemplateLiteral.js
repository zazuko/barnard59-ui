import Vue from 'vue/dist/vue.js'

export default Vue.component('implemented-by-template-literal', {
  props: [
    'implementation'
  ],
  data: () => ({
    value: ''
  }),
  watch: {
    value: function () {
      this.implementation['@value'] = this.value
    }
  },
  template: `<textarea class="form-control" rows="20" v-model="value">{{ implementation['@value'] }}</textarea>`
})
