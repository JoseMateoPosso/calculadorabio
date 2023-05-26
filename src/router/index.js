
import { createRouter, createWebHistory } from 'vue-router'

import FormCard from '../components/FormCard.vue'
import HuellaCarbono from '../components/HuellaCarbono.vue'
import CheckImg from '../components/CheckImg.vue'
import FormPrincipal from '../components/FormPrincipal.vue'


const routes = [
  {
    path: '/',
    name: 'HuellaCarbono',
    component: HuellaCarbono
  },
  {
    path: '/formcard',
    name: 'FormCard',
    component: FormCard
  },
  {
    path: '/img',
    name: 'CheckImg',
    component: CheckImg
  },
  {
    path: '/formprincipal',
    name: 'FormPrincipal',
    component: FormPrincipal
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
