<template>
  <div class="flex flex-col h-screen">
    <h2 class="m-4 text-4xl font-bold">Refreshable ScrollView</h2>
    <h4 class="mx-4 mb-2 text-lg text-gray-400">
      iOS Style Vue component that you can pull to refresh.
    </h4>
    <RefreshableScrollView
      class="flex-grow overflow-y-auto"
      :on-refresh="onRefersh"
    >
      <template #loading="{ state, progress }">
        <div class="grid w-full h-full text-gray-500 place-items-center">
          {{ state }}
        </div>
      </template>
      <div class="px-2">
        <template v-for="(item, index) in items" :key="index">
          <div class="py-2">
            {{ item }}
          </div>
        </template>
      </div>
    </RefreshableScrollView>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      items: [...Array(51).keys()],
    }
  },
  methods: {
    async onRefersh() {
      await new Promise((res) => setTimeout(res, 2000))
    },
  },
})
</script>
