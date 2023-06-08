import { createRouter, createWebHistory } from 'vue-router'
import FormCard from '../components/FormCard.vue'

const routes = [
  {
    path: '/',
    name: 'FormCard',
    component: FormCard
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
