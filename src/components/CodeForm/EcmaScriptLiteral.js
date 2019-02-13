import Vue from 'vue/dist/vue.js'

export default Vue.component('implemented-by-ecmascript-literal', {
  props: [
    'implementation'
  ],
  template: `<textarea class="form-control" rows="20" v-model="implementation['@value']"></textarea>`
})
