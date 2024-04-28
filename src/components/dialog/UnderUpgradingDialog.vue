<script setup>
import Modal from '../Modal.vue'
import { useMessage } from 'naive-ui'
import { formatTime, getResourceArr, getTime, checkUpgrade, getRateToCount } from '../../utils/index'
import { infantry, knights } from '../../libs/barrack'
import "../../assets/styles/dialog.scss"

const emit = defineEmits(['startTrainingFun', 'upgrade', 'close'])
const props = defineProps({
  underUpgradingData: {
    type: Object,
    default: {}
  },
  resourceData: {
    type: Object,
    default: {
      "wood": 0,
      "steel": 0,
      "brick": 0,
      "food": 0
    }
  }
})

const message = useMessage()

const getTrainingData = (buildingKind) => {
  if (buildingKind == 8) {
    return infantry
  } else {
    return knights
  }
}

const startTrainingFun = (barrackKind) => {
  emit('startTrainingFun', barrackKind)
}

const upgrade = (item) => {
  let disabled = checkUpgrade(item.buildingKind, item?.level?.level, props.resourceData)
  if (disabled == 1) {
    message.error('Building is under upgrading')
    return
  } else if (disabled == 3) {
    message.error('Resource is not enough')
    return
  } else if (disabled == 4) {
    message.error('You can only build 2 buildings at the same time')
    return
  }
  emit('upgrade', item)
}

const close = () => {
  emit('close')
}
</script>
<template>
  <Modal v-if="Object.keys(underUpgradingData).length" @close="close">
    <template v-slot:title>
      <div class="flex-center"><img :src="underUpgradingData.img" style="width: 30px;margin-right: 10px" alt="">{{ underUpgradingData.name }} - level {{ underUpgradingData?.level?.level }}</div>
    </template>
    <div class="building-list">
      <div class="building-item">
        <div class="building-item-bd flex-center">
          <div class="building-item-desc">{{ underUpgradingData.desc }}</div>
        </div>
        <div class="building-item-resource flex-center-center">
          <div
            v-for="(resource, index) in getResourceArr(underUpgradingData.buildingKind, underUpgradingData?.level?.level)"
            :key="index" class="building-item-resource-item flex-center">
            <div class="icon flex-center-center">
              <img v-if="index == 0" src="../../assets/images/resource_icon_1.png" alt="">
              <img v-else-if="index == 1" src="../../assets/images/resource_icon_2.png" alt="">
              <img v-else-if="index == 2" src="../../assets/images/resource_icon_3.png" alt="">
              <img v-else-if="index == 3" src="../../assets/images/resource_icon_4.png" alt="">
            </div>
            <div class="amount">{{ resource }}</div>
          </div>
        </div>
        <div class="building-item-hint" v-if="underUpgradingData.buildingKind >= 1 && underUpgradingData.buildingKind <= 4">
          <span>{{ getRateToCount(underUpgradingData.buildingKind, underUpgradingData?.level?.level) }}</span>
        </div>
        <div class="btn flex-center-center" :class="{ 'btn-disabled': checkUpgrade(underUpgradingData.buildingKind, underUpgradingData?.level?.level, props.resourceData) }" @click="upgrade(underUpgradingData)">Upgrade To Level {{ (+underUpgradingData.level.level) + 1 }}</div>
        <div class="building-item-time flex-center-center">
          <svg width="11" height="11" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5V11L15 13M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
              stroke="black" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ (getTime(underUpgradingData.buildingKind, underUpgradingData?.level?.level)) }}</span>
        </div>
      </div>
      <div v-if="underUpgradingData.buildingKind == 8 || underUpgradingData.buildingKind == 9">
        <div v-for="(item, index) in getTrainingData(underUpgradingData.buildingKind)" :key="index" class="building-item barrack">
          <div class="building-item-hd flex-center">{{ item.name }}</div>
          <div class="building-item-bd flex-center">
            <div class="building-item-img">
              <img :src="item.img" alt="">
            </div>
            <div class="flex-start-sb barrack-info">
              <div class="building-item-desc">{{ item.desc }}</div>
              <div class="building-item-resource flex-center-sb">
                <div v-for="(resource, index) in item.resource" :key="index"
                  class="building-item-resource-item flex-center">
                  <div class="icon flex-center-center">
                    <img :src="resource.img" alt="">
                  </div>
                  <div class="amount">{{ resource.count }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn flex-center-center" @click="startTrainingFun(item.barrackKind)">Train</div>
        </div>
      </div>
    </div>
  </Modal>
</template>