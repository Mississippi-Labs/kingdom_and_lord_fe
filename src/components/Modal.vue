<script setup>
// emit
const emit = defineEmits(['close'])
const props = defineProps(['mainStyle', 'style'])

const close = () => {
  emit('close')
}
</script>
<template>
  <div class="modal-wrap flex-center-center" @click="close">
    <div class="modal flex-center-center" :style="style" @click.stop>
      <div class="header">
        <div class="header-content flex-center-sb">
          <div class="title">
            <slot name="title"></slot>
          </div>
          <img src="../assets/images/button_3.png" alt="" class="close-btn" @click="close">
        </div>
      </div>
      <main :style="mainStyle">
        <slot></slot>
      </main>
      <footer>
      </footer>
    </div>
  </div>

</template>
<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  z-index: 3000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}
.modal {
  width: 540px;
  max-height: 80vh;
  font-size: 0;
  overflow: hidden;
  flex-direction: column;

  .header {
    background: url('../assets/images/modal_header_bg.png') no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    width: 100%;
    height: 78px;
    flex: 0 0 78px;

    .header-content {
      height: 62px;
      padding: 0 18px;

      .title {
        font-size: 16px;
        color: #fff;
      }

      .close-btn {
        width: 32px;
        height: 32px;
        cursor: pointer;
      }
    }
  }

  main {
    background: url('../assets/images/modal_body_bg.png') repeat;
    background-position: 0 0;
    background-size: 100% auto;
    width: 100%;
    padding: 8px 18px;
    box-sizing: border-box;
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  footer {
    background: url('../assets/images/modal_footer_bg.png') no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    width: 100%;
    height: 25px;
    flex: 0 0 25px;
    margin-top: -1px;
  }
}
</style>