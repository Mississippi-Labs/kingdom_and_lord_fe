<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { formatTime, getResourceArr, getTime } from '../utils/index'
import { isUpgrading } from '../utils/data'

const props = defineProps({
  building: {
    type: Object,
    default: {}
  },
  style: {
    type: Object,
    default: { left: 0, top: 0 }
  }
})
</script>
<template>
  <div class="upgrade-info" :style="style">
    <div class="info-hd flex-center">
      <p class="flex-end">{{ building?.name }}<span> - Level {{ building?.level?.level }}</span></p>
      <p v-if="isUpgrading(building?.buildingId)" style="margin-left: .25em;">(under upgrading)</p>
    </div>
    <div class="info-bd">
      <p>Upgrading to level {{ building?.level?.level + 1 }} requires resources</p>
      <div class="flex-center-sb consume">
        <div v-for="(num, index) in getResourceArr(building?.buildingKind, building?.level?.level)" class="flex-center">
          <img v-if="index == 0" src="../assets/images/resource_icon_1.png" alt="">
          <img v-else-if="index == 1" src="../assets/images/resource_icon_2.png" alt="">
          <img v-else-if="index == 2" src="../assets/images/resource_icon_3.png" alt="">
          <img v-else-if="index == 3" src="../assets/images/resource_icon_4.png" alt="">
          <span>{{ num }}</span>
        </div>
      </div>
      <div class="flex-center time">
        <img src="../assets/images/time.png" alt="">
        <span>{{ (getTime(building?.buildingKind, building?.level?.level)) }}</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.upgrade-info {
  position: fixed;
  width: 320px;
  height: 145px;
  background: rgba($color: #000000, $alpha: 0.8);
  z-index: 99;
  top: 80px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  z-index: 9;

  .info-hd {
    width: 100%;
    height: 30px;
    background: rgba($color: #000000, $alpha: 0.5);
    font-size: 12px;
    color: #fff;
    font-family: 'Chalkboard-Bold';
    border-radius: 6px;
    padding: 0 10px;
    box-sizing: border-box;

    span {
      font-size: 10px;
      margin-left: .5em;
    }
  }

  .info-bd {
    margin-top: 10px;
    font-size: 10px;
    color: #fff;
    padding: 0 10px;
    box-sizing: border-box;

    .consume {
      margin-top: 16px;

      img {
        width: 20px;
        margin-right: 6px;
      }
    }

    .time {
      margin-top: 16px;

      img {
        width: 12px;
        height: 12px;
        margin-right: 10px;
      }
    }
  }
}
</style>