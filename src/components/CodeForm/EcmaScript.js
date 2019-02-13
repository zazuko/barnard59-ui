import Vue from 'vue/dist/vue.js'

export default Vue.component('implemented-by-ecmascript', {
  props: [
    'implementation'
  ],
  template: `<input type="text" class="form-control" id="" v-model="implementation['code:link']">`
})
