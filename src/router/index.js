import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'

const routes = [{
  path: '/',
  name: 'Index',
  component: Index
}, {
  path: '/demo',
  name: 'Home',
  component: Home
}]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
