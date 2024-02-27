import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import { create, NMessageProvider, NDialogProvider, NSpin, NButton, NCard, NProgress } from 'naive-ui'

const naive = create({
  components: [ NMessageProvider, NDialogProvider, NSpin, NButton, NCard, NProgress ]
})
createApp(App).use(router).use(naive).mount('#app')
