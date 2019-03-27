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
import * as actions from '../store/pipeline/action-types'

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
      load: actions.load,
      reload: actions.reload,
      save: actions.save,
      publish: actions.publish
    }),
    async update () {
      this.load({ pipelineIri: LdNavigator.resourceUrl })
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
        <b-button @click="save">save pipeline</b-button>
        <b-button variant="primary" @click="publish">publish pipeline</b-button>
        <b-button variant="danger" @click="reload">reload from server</b-button>
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
