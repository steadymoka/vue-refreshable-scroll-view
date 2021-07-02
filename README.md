# Vue Refreshable Scroll View

<p>
  <a href="https://npmcharts.com/compare/vue-refreshable-scroll-view?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/vue-refreshable-scroll-view.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/vue-refreshable-scroll-view"><img alt="Version" src="https://img.shields.io/npm/v/vue-refreshable-scroll-view.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/vue-refreshable-scroll-view"><img alt="License" src="https://img.shields.io/npm/l/vue-refreshable-scroll-view.svg?style=flat-square" /></a>
  <img alt="VueJS 3.x" src="https://img.shields.io/badge/vue.js-3.x-brightgreen.svg?style=flat-square" />
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
</p>

iOS Style Vue component (for Vue 3.0) that you can pull to refresh.

[See Example](https://) ([sources](./example))

## Installation

```bash
npm i vue-refreshable-scroll-view
```

## Usage

```js
import { createApp } from 'vue'
import RefreshableScrollView from 'vue-refreshable-scroll-view'

const app = createApp(/* */)

app.use(RefreshableScrollView) // export default is plugin
```

**Local Registration**

[Vue3 Local Registration Guide](https://v3.vuejs.org/guide/component-registration.html#local-registration)

```vue
<template>
  <div class="h-screen overflow-y-hidden">
    <RefreshableScrollView
      class="h-full overflow-y-auto"
      :on-refresh="onRefersh"
    >
      <template #loading="{ state, progress }">
        <div>
          {{ state }}
        </div>
      </template>
      <div>
        <template v-for="(item, index) in items" :key="index">
          <div>
            {{ item }}
          </div>
        </template>
      </div>
    </RefreshableScrollView>
  </div>
</template>
<script>
import { RefreshableScrollView } from 'vue-refreshable-scroll-view'

export default {
  components: {
    RefreshableScrollView,
  },
  methods: {
    async onRefersh() {
      await work()
    },
  },
}
</script>
```

## Options

### Props

| Name              | Type       | Default | Example          |
| ----------------- | :--------- | ------- | ---------------- |
| distanceToRefresh | `number`   | `42`    |                  |
| damping           | `number`   | `224`   |                  |
| scale             | `number`   | `0.6`   | between 0 ~ 1    |
| onRefresh         | `function` | `null`  | `async function` |

### Events

| Name         | Type    |
| ------------ | :------ |
| scroll:event | `event` |

### Slots

| Name    | Prop                                  | Default       |
| ------- | :------------------------------------ | ------------- |
| default | `{ }`                                 |               |
| loading | `{ state: string, progress: number }` | `{{ state }}` |
