import Graph from './Graph.js'
import Step from './Step.js'
import Steps from './Steps.vue'
import Variables from './Variables'
import Vue from 'vue/dist/vue.js'
import Button from 'bootstrap-vue/es/components/button/button'
import Tabs from 'bootstrap-vue/es/components/tabs/tabs'
import Tab from 'bootstrap-vue/es/components/tabs/tab'
import LdNavigator from 'ld-navigation/LdNavigator'
import { createNamespacedHelpers } from 'vuex'
import { frame } from '../store/pipeline'

const { mapActions, mapGetters, mapState } = createNamespacedHelpers('pipeline')

export default Vue.component('pipeline', {
  components: {
    Graph,
    Step,
    Steps,
    Variables,
    'b-tabs': Tabs,
    'b-tab': Tab,
    'b-button': Button
  },
  data: function () {
    return {
      context: frame,
      pipelineGraph: null
    }
  },
  created: function () {
    this.update()
  },
  methods: {
    ...mapActions({
      load: 'load',
      saveClicked: 'save'
    }),
    update: async function () {
      this.load(LdNavigator.resourceUrl)
    }
  },
  computed: {
    ...mapState({
      steps: 'steps',
      step: 'selectedStep',
      pipeline: 'graph'
    }),
    ...mapGetters({
      variables: 'variables'
    })
  },
  template: `
    <div>
      <b-tabs>
        <b-tab title="Steps">
          <div class="row">
            <div class="col-lg-3">
              <steps :steps="steps"></steps>
              
            </div>
            <div class="col-lg-9">
              <step :step="step"></step>
            </div>
          </div>
        </b-tab>
        <b-tab title="Variables">
          <variables :variables="variables"></variables>
        </b-tab>
      </b-tabs>
      
      <div class="row">
        <div class="col-lg-3">
          <b-button variant="primary" v-on:click="saveClicked">save</b-button>
        </div>
      </div>
      
      <div class="row">
        <div class="col-lg-12">
          <graph ref="graph" v-bind:json-ld="pipeline" v-bind:context="context" syntax="json-ld"></graph>
        </div>
      </div>
    </div>
  `
})
