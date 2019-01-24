import nodeLabel from '../utils/nodeLabel.js'
import ns from '../utils/namespaces.js'
import Vue from 'vue/dist/vue.js'

export default Vue.component('steps', {
  props: [
    'baseUrl',
    'pipeline'
  ],
  components: {
  },
  data: function () {
    return {
      nodeLabel,
      steps: []
    }
  },
  created: function () {
    this.update()
  },
  watch: {
    pipeline: function () {
      this.update()
    }
  },
  methods: {
    update: function () {
      if (!this.pipeline) {
        this.steps = []

        return
      }

      this.steps = [...this.pipeline.out(ns.p('steps')).out(ns.p('stepList')).list()]
    },
    add: function (index) {
      const step = this.pipeline.node(`${this.baseUrl}${index}`, { type: 'NamedNode' })

      step.addOut(ns.code('implementedBy'), this.pipeline.node('Hello World!', { datatype: ns.code('EcmaScriptTemplateLiteral') }))

      this.steps.splice(index, 0, step)

      this.pipeline.out(ns.p('steps')).deleteList(ns.p('stepList'))
      this.pipeline.out(ns.p('steps')).addList(ns.p('stepList'), this.steps)
    },
    remove: function (index) {
      this.steps.splice(index, 1)

      this.pipeline.out(ns.p('steps')).deleteList(ns.p('stepList'))
      this.pipeline.out(ns.p('steps')).addList(ns.p('stepList'), this.steps)
    },
    selected: function (step) {
      this.$emit('step-click', step)
    }
  },
  template: `
    <div v-if="pipeline">
      <table class="table">
        <tr>
          <td></td>
          <td><button class="btn btn-success" v-on:click="add(0)">+</button></td>
        </tr>
        
        <tr v-for="(step, index) in steps">
          <td><a href="javascript:void(0)" v-on:click="$emit('input', step)">{{ nodeLabel(step) }}</a></td>
          <td>
            <button class="btn btn-success" v-on:click="add(index + 1)">+</button>
            <button class="btn btn-danger" v-on:click="remove(index)">-</button>
          </td>
        </tr>
      </table>
    </div>
  `
})
