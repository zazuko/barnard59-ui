<script>
import Graph from './Graph.vue'
import Step from './Step.vue'
import Steps from './Steps.vue'
import Variables from './Variables.vue'
import Button from 'bootstrap-vue/es/components/button/button'
import Tabs from 'bootstrap-vue/es/components/tabs/tabs'
import Tab from 'bootstrap-vue/es/components/tabs/tab'
import LdNavigator from 'ld-navigation/LdNavigator'
import { createNamespacedHelpers, mapState as mapRootState } from 'vuex'
import { frame } from '../store/pipeline/actions'

const { mapActions, mapGetters, mapState } = createNamespacedHelpers('pipeline')

export default {
  components: {
    Graph,
    Step,
    Steps,
    Variables,
    'b-tabs': Tabs,
    'b-tab': Tab,
    'b-button': Button
  },
  data () {
    return {
      context: frame,
      pipelineGraph: null
    }
  },
  created () {
    this.update()
  },
  methods: {
    ...mapActions({
      load: 'load',
      saveClicked: 'save'
    }),
    async update () {
      this.load(LdNavigator.resourceUrl)
    }
  },
  computed: {
    ...mapState({
      steps: 'steps',
      step: 'selectedStep',
      pipeline: 'instance'
    }),
    ...mapGetters({
      variables: 'variables'
    }),
    ...mapRootState({
      graph: 'resourceGraph'
    })
  }
}
</script>

<template>
  <div v-if="pipeline">
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
        <b-button variant="primary" @click="saveClicked">save</b-button>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <graph
          ref="graph"
          :json-ld="graph"
          :context="context"
          syntax="json-ld"></graph>
      </div>
    </div>
  </div>
</template>
