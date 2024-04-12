<script setup>
import Modal from '../Modal.vue'
import { useMessage } from 'naive-ui'
import { formatTime, getResourceArr, getTime, checkUpgrade } from '../../utils/index'
import { useGlobalStore } from '../../hooks/globalStore.js'
import { innerBuildingOptions, cityWall } from '../../libs/building.js'
import "../../assets/styles/dialog.scss"

const emit = defineEmits(['createBuilding', 'close'])
const props = defineProps({
  buildingData: {
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

const { store } = useGlobalStore()
const message = useMessage()

// 判断是否可以建造
const checkCreate = (buildingKind) => {
  let res = checkUpgrade(buildingKind, 0, props.resourceData)
  if (res) {
    return res
  } else {
    const { warehouse, barn } = store.dojoComponents
    if (buildingKind == 6 && warehouse.length) {
      if (warehouse.some(item => item.level.level < 20)) {
        return 2
      }
    } else if (buildingKind == 7 && barn.length) {
      if (barn.some(item => item.level.level < 20)) {
        return 2
      }
    }
  }
}

const getInnerBuildingOptions = () => {
  if (props.buildingData.buildingId == 18) {
    return [cityWall]
  }
  const { cityHall, stable, barrack, college, embassy } = store.dojoComponents
  const list = JSON.parse(JSON.stringify(innerBuildingOptions))
  if (cityHall.length) {
    list.splice(list.findIndex(item => item.buildingKind == 5), 1)
  }
  if (stable.length) {
    list.splice(list.findIndex(item => item.buildingKind == 9), 1)
  }
  if (barrack.length) {
    list.splice(list.findIndex(item => item.buildingKind == 8), 1)
  }
  if (college.length) {
    list.splice(list.findIndex(item => item.buildingKind == 10), 1)
  }
  if (embassy.length) {
    list.splice(list.findIndex(item => item.buildingKind == 11), 1)
  }
  return list
}

const createBuilding = (item) => {
  let disabled = checkCreate(item.buildingKind)
  if (disabled == 1) {
    message.error('Building is under upgrading')
    return
  } else if (disabled == 2) {
    message.error('One must be full before the other can be covered')
    return
  } else if (disabled == 3) {
    message.error('Resource is not enough')
    return
  } else if (disabled == 4) {
    message.error('You can only build 2 buildings at the same time')
    return
  }
  emit('createBuilding', item)
}

const close = () => {
  emit('close')
}

</script>
<template>
  <Modal v-if="Object.keys(buildingData).length" @close="close">
    <template v-slot:title>New Building</template>
    <div class="building-list">
      <div v-for="(item, index) in getInnerBuildingOptions()" :key="index" class="building-item">
        <div class="building-item-hd flex-center">{{ item.name }}</div>
        <div class="building-item-bd flex-center">
          <div class="building-item-desc">{{ item.desc }}</div>
          <div class="building-item-img">
            <img :src="item.img" alt="">
          </div>
        </div>
        <div class="building-item-resource flex-center-center">
          <div v-for="(resource, index) in getResourceArr(item.buildingKind, 0)" :key="index"
            class="building-item-resource-item flex-center">
            <div class="icon flex-center-center">
              <img v-if="index == 0" src="../../assets/images/resource_icon_1.png" alt="">
              <img v-else-if="index == 1" src="../../assets/images/resource_icon_2.png" alt="">
              <img v-else-if="index == 2" src="../../assets/images/resource_icon_3.png" alt="">
              <img v-else-if="index == 3" src="../../assets/images/resource_icon_4.png" alt="">
              <img v-else-if="index == 4" src="../../assets/images/resource_icon_5.png" alt="">
            </div>
            <div class="amount">{{ resource }}</div>
          </div>
        </div>
        <div class="building-item-time flex-center-center">
          <svg width="11" height="11" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5V11L15 13M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
              stroke="black" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ formatTime(getTime(item.buildingKind, 0)) }}</span>
        </div>
        <div class="btn flex-center-center" :class="{ 'btn-disabled': checkCreate(item.buildingKind) }"
          @click="createBuilding(item)">Build</div>
      </div>
    </div>
  </Modal>
</template>