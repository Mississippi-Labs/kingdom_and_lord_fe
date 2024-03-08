<script setup>
import { provide, reactive, watch } from 'vue';

const props = defineProps({
  value: Object,
});

const dojoContext = reactive({
  setup: props.value.setup,
  account: props.value.account,
});

watch(() => props.value, (value) => {
  dojoContext.setup = value.setup;
  dojoContext.account = value.account;
}, {deep: true});

provide('DojoContext', dojoContext);

</script>

<template>
  <slot></slot>
</template>
