<script setup>
import { ref } from 'vue'
</script>

<template>
  <n-list bordered style="margin-top: 68px;margin-right: 20px;" hoverable>
    <template #header>
      <p style="font-size: 18px;font-weight: 500;line-height: 2.5;">Inbox</p>
    </template>
    <n-list-item>
      <n-thing title="Please Help Me" title-extra="Player1"  style="padding: 20px;border-bottom: 1px solid rgb(239, 239, 245);">
        My kindom is under attack. Please send me some soldiers.
      </n-thing>
    </n-list-item>
    <n-list-item >
      <n-thing title="Alliance Call" title-extra="Player1"  style="padding: 20px;border-bottom: 1px solid rgb(239, 239, 245);">
        Please donate some supplies to the Coalition to help grow together!
      </n-thing>
    </n-list-item>
    <n-list-item >
      <n-thing title="Battle report" title-extra="Admin"  style="padding: 20px;border-bottom: 1px solid rgb(239, 239, 245);">
        Village 1 captured Village 2 and won.
      </n-thing>
    </n-list-item>
    <n-list-item >
      <n-thing title="Battle report" title-extra="Admin"  style="padding: 20px;">
        Village 1 captured Village 2 and won.
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<style lang="scss">
.n-thing {
  &:hover {
    background-color: #f5f7f8;
  }
}
</style>
