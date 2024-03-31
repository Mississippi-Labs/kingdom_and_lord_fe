<script setup>
import { watch, ref, nextTick } from "vue";
import { outBuildingList, outBuildingOptions } from '../libs/building.js'
import { useGlobalStore } from '../hooks/globalStore.js'

const emit = defineEmits(['upgradeBuilding'])

const { store } = useGlobalStore()

const buildingRef = ref(null)
const contentRef = ref(null)

const getLevel = (buildingId) => {
  if (!store.dojoComponents.cityBuilding) return 0
  const building = store.dojoComponents.cityBuilding.find(item => item.building_id === buildingId)
  return building?.level?.level || 0
}

const upgrade = (data) => {
  const building = store.dojoComponents.cityBuilding.find(item => item.building_id === data.buildingId)
  let op = outBuildingOptions.find(item => item.buildingKind == data.buildingKind)
  emit('upgradeBuilding', Object.assign(data, building, op))
}

const setBuildingRef = (menuIndex) => {
  if (menuIndex === 0) {
    buildingRef.value.style.zIndex = '9'
  } else if (menuIndex === 1) {
    buildingRef.value.style.zIndex = '-1'
  } else {
    buildingRef.value.style.zIndex = '-1'
  }
}

watch(() => buildingRef.value, (newData) => {
  if (newData) {
    const menuIndex = store.state.menuIndex
    setBuildingRef(menuIndex)
  }
})

watch(() => store.state.menuIndex, (newData) => {
  nextTick(() => {
    setBuildingRef(newData)
  })
})

</script>
<template>
  <div class="out-building" ref="buildingRef">
    <div class="out-content" ref="contentRef">
      <img src="../assets/images/out_bg.jpg" class="out-bg" alt="">
      <div class="out-building-list">
        <div v-for="item in outBuildingList" :key="item.buildId" class="out-building-item flex-center-center"
          :style="{ left: item.left, top: item.top }" @click="upgrade(item)">{{ getLevel(item.buildingId) }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@media screen and (max-aspect-ratio: 8/5) {
  .out-content {
    .out-bg {
      height: 100vh !important;
      width: auto !important;
    }
  }
}

.out-building {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;

  .out-content {
    position: relative;
    display: inline-block;
    // opacity: 0;
    // transform: scale(6);
    // transform-origin: 45% 42%;

    .out-bg {
      width: 100%;
      height: auto;
    }

    .out-building-list {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      .out-building-item {
        position: absolute;
        width: 30px;
        height: 30px;
        background: rgba($color: #000000, $alpha: 1);
        border-radius: 50%;
        cursor: pointer;
        color: #fff;
        font-size: 14px;
        z-index: 99;
      }
    }
  }
}
</style>