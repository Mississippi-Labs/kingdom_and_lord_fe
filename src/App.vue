<script setup>
import { ref, watch, onBeforeMount } from 'vue'

onBeforeMount(() => {
  let isV2 = localStorage.getItem('isV2') || ''
  if (isV2 != 3) {
    // 清除所有缓存
    localStorage.clear()
    localStorage.setItem('isV2', 3)
  }
})
</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <router-view></router-view>
    </n-dialog-provider>
  </n-message-provider>
</template>
