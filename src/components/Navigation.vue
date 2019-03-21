<script>
import Vue from 'vue/dist/vue.js'
import Modal from 'bootstrap-vue/es/components/modal/index'
import Nav from 'bootstrap-vue/es/components/navbar/index'
import FormInput from 'bootstrap-vue/es/components/form-input/form-input'
import Dropdown from 'bootstrap-vue/es/components/dropdown/index'
import 'ld-navigation/ld-link'
import { createNamespacedHelpers } from 'vuex'

Vue.use(Nav)
Vue.use(Dropdown)
Vue.use(Modal)

const { mapGetters, mapState, mapActions } = createNamespacedHelpers('pipeline')

export default {
  components: {
    'b-form-input': FormInput
  },
  props: [
    'jobIri',
    'pipelineIri'
  ],
  methods: {
    ...mapActions([
      'addPipeline'
    ])
  },
  computed: {
    ...mapState({
      pipeline: 'instance',
      pipelineBaseIri: 'baseIri'
    }),
    ...mapGetters({
      pipelines: 'pipelines'
    }),
    pipelineRootLabel () {
      if (!this.pipelineIri) {
        return ''
      }

      return this.pipelineIri.slice(new URL(this.pipelineIri).origin.length, this.pipelineIri.indexOf('#'))
    },
    pipelineLabel () {
      return (pipelineId) => pipelineId && pipelineId.slice(this.pipelineBaseIri.length - 1)
    }
  },
  data () {
    return {
      jobsBaseUrl: '/job/',
      slug: ''
    }
  }
}
</script>

<template>
  <b-navbar toggleable="md">
    <b-navbar-brand href="/">Barnard 59</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav v-if="jobIri">
        <router-link class="nav-link" :to="{ path: '/' }">Start</router-link>
        <router-link class="nav-link" :to="{ path: '/job/' }">Jobs</router-link>
        <router-link class="nav-link" :to="{ path: jobIri }">
          {{ jobIri.slice(jobsBaseUrl.length) }}
        </router-link>
      </b-navbar-nav>
      <b-navbar-nav v-if="pipelineIri">
        <router-link class="nav-link" :to="{ path: '/' }">Start</router-link>
        <router-link class="nav-link" :to="{ path: '/pipeline/' }">Pipelines</router-link>
        <ld-link :resource-url="pipelineIri">
          <a class="nav-link">{{ pipelineRootLabel }}</a>
        </ld-link>
        <a class="nav-link">{{ pipelineLabel(pipeline.id) }}</a>
        <b-dropdown variant="link">
          <b-dropdown-item v-for="p in pipelines" :key="p.id" :active="p.id === pipeline.id">
            {{ pipelineLabel(p.id) }}
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item v-b-modal.newPipeline>
            New pipeline
          </b-dropdown-item>
        </b-dropdown>
      </b-navbar-nav>
    </b-collapse>

    <b-modal id="newPipeline" @ok="addPipeline({ slug })" title="New pipeline">
      <b-form-input label="URI slug" v-model="slug"></b-form-input>
    </b-modal>
  </b-navbar>
</template>
