<script setup>
</script>
<template>
  <div class="loading">
    <n-spin size="large" />
  </div>
</template>
<style scoped lang="scss">
.loading {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>