import './example.css'

import { createApp } from 'vue'
import RefreshableScrollView from 'refreshable-scroll-view'

import Example from './Example.vue'

const app = createApp(Example)

app.use(RefreshableScrollView)

app.mount('#app')
