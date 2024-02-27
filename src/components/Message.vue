<script setup>
import { ref } from 'vue'
</script>

<template>
  <n-list bordered style="margin-top: 68px;margin-right: 20px;">
    <template #header>
      <p style="font-size: 18px;font-weight: 500;line-height: 2.5;">Inbox</p>
    </template>
    <n-list-item >
      <n-thing title="Thing" title-extra="extra" description="description" style="padding: 20px;">
        Biu<br>
        Biu<br>
        Biu<br>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<style scoped lang="scss">

</style>
