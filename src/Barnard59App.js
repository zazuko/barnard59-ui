import JobPage from './pages/Job.vue'
import JobsPage from './pages/Jobs.vue'
import OverviewPage from './pages/Overview.vue'
import PipelinePage from './pages/Pipeline.vue'
import PipelinesPage from './pages/Pipelines.vue'
import Router from 'vue-router/dist/vue-router.common.js'
import Vue from 'vue/dist/vue.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import LdNavigator from 'ld-navigation/LdNavigator'
import config from './config'
import Toasted from 'vue-toasted'

Vue.use(Toasted)
Vue.use(Router)
LdNavigator.base = localStorage.getItem('baseUrl') || config.baseUrl

const routes = [{
  path: '/',
  name: 'overview',
  component: OverviewPage
}, {
  path: '/job/',
  name: 'jobs',
  component: JobsPage
}, {
  path: '/job/:id',
  name: 'job',
  component: JobPage
}, {
  path: '/pipeline/',
  name: 'pipelines',
  component: PipelinesPage
}, {
  path: '/pipeline/:id',
  name: 'pipeline',
  component: PipelinePage
}]

const router = new Router({
  mode: 'history',
  routes
})

new Vue({ router }).$mount('#barnard59-app')
