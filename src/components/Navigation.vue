<script>
import Vue from 'vue/dist/vue.js'
import Button from 'bootstrap-vue/es/components/button/index'
import Nav from 'bootstrap-vue/es/components/navbar/index'
import FormInput from 'bootstrap-vue/es/components/form-input/index'
import FormGroup from 'bootstrap-vue/es/components/form-group/index'
import Form from 'bootstrap-vue/es/components/form/index'
import Dropdown from 'bootstrap-vue/es/components/dropdown/index'
import 'ld-navigation/ld-link'
import { createNamespacedHelpers } from 'vuex'
import { addPipeline, select } from '../store/pipeline/action-types'

Vue.use(Nav)
Vue.use(Dropdown)
Vue.use(Form)
Vue.use(FormInput)
Vue.use(FormGroup)
Vue.use(Button)

const { mapGetters, mapState, mapActions } = createNamespacedHelpers('pipeline')

export default {
  props: [
    'jobIri',
    'pipelineIri'
  ],
  methods: {
    ...mapActions({
      realAdd: addPipeline,
      select
    }),
    addPipeline (slug) {
      if (slug) {
        this.realAdd({ slug })
          .then(() => this.$refs.newPipelineDD.hide())
          .catch(e => this.$toasted.show(e.message).goAway(1000))
      }
    }
  },
  computed: {
    ...mapState({
      pipeline: 'instance'
    }),
    ...mapGetters({
      pipelines: 'pipelines'
    }),
    pipelineRootLabel () {
      if (!this.pipelineIri) {
        return ''
      }

      const hashIndex = this.pipelineIri.indexOf('#')
      return this.pipelineIri.slice(new URL(this.pipelineIri).origin.length, hashIndex === -1 ? undefined : hashIndex)
    },
    pipelineLabel () {
      return (pipeline) => {
        if (!pipeline) {
          return 'Select pipeline'
        }

        return pipeline.id
      }
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
  <div>
    <h1>Zazuko Data Pipelines</h1>
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
          <b-dropdown ref="newPipelineDD" variant="link" :text="pipelineLabel(pipeline)">
            <b-dropdown-item
              v-for="p in pipelines"
              :key="p.id"
              :active="pipeline && p.id === pipeline.id"
              @click="select(p.id)">
              {{ pipelineLabel(p) }}
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>

            <b-dropdown-form @submit.prevent="addPipeline(slug)">
              <b-form-group label="URI slug">
                <b-form-input required v-model="slug"></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary" size="sm">Add pipeline</b-button>
            </b-dropdown-form>
          </b-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
