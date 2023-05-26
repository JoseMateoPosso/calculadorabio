/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 * eslint-disable 
 */
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'


export default createVuetify({
  ssr:true,
  components: {
    ...components,
    ...labsComponents,
  },
})