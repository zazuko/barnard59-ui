import JobPage from './pages/Job.js'
import JobsPage from './pages/Jobs.js'
import OverviewPage from './pages/Overview.js'
import PipelinePage from './pages/Pipeline.js'
import PipelinesPage from './pages/Pipelines.js'
import Router from 'vue-router/dist/vue-router.common.js'
import Vue from 'vue/dist/vue.js'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(Router)

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
