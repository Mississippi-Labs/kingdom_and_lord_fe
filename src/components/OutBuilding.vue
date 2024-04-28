<script setup>
import { watch, ref, nextTick } from "vue";
import { outBuildingList, outBuildingOptions } from '../libs/building.js'
import { useGlobalStore } from '../hooks/globalStore.js'
import { getLevelBg } from '../utils/index'

const emit = defineEmits(['upgradeBuilding'])
const props = defineProps({
  resource: {
    type: Object,
    default: {
      "wood": 0,
      "steel": 0,
      "brick": 0,
      "food": 0
    }
  }
})

const { store, setMenuIndex } = useGlobalStore()

const buildingRef = ref(null)
const contentRef = ref(null)

const getLevel = (buildingId) => {
  if (!store.dojoComponents.cityBuilding) return 0
  const building = store.dojoComponents.cityBuilding.find(item => item.building_id == buildingId)
  return building?.level?.level || 0
}

const getBg = (buildingId) => {
  const building = store.dojoComponents.cityBuilding.find(item => item.building_id == buildingId)
  if (!building) return ''
  building.buildingKind = building.building_kind
  return getLevelBg(buildingId, building, props.resource)
}

const upgrade = (data) => {
  const building = store.dojoComponents.cityBuilding.find(item => item.building_id == data.buildingId)
  const op = outBuildingOptions.find(item => item.buildingKind == data.buildingKind)
  emit('upgradeBuilding', Object.assign(data, building, op))
}

const setBuildingRef = (menuIndex) => {
  if (menuIndex == 0) {
    buildingRef.value.style.zIndex = '9'
  } else if (menuIndex == 1) {
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
  <div class="out-building flex-center-center" ref="buildingRef">
    <div class="out-content" ref="contentRef">
      <img src="../assets/images/out_bg.jpg" class="out-bg" alt="">
      <div class="out-building-list">
        <div v-for="item in outBuildingList" :key="item.buildId" class="out-building-item flex-center-center"
          :style="{ left: item.left, top: item.top, 'background-image': getBg(item.buildingId) }"
          @click="upgrade(item)">{{ getLevel(item.buildingId) }}
        </div>
        <div class="center" @click="setMenuIndex(1)"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@media screen and (min-width: 1440px) {
  .out-building {
    position: relative;

    .out-content {
      .out-bg {
        height: auto !important;
        width: 1440px !important;
      }
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
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(../assets/images/out_bg.jpg) no-repeat center center;
    background-size: cover;
    filter: blur(10px);
    z-index: 1;
  }

  .out-content {
    position: relative;
    display: inline-block;
    z-index: 2;
    // opacity: 0;
    // transform: scale(6);
    // transform-origin: 45% 42%;

    .out-bg {
      height: 100vh;
      width: auto;
    }

    .out-building-list {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      .out-building-item {
        position: absolute;
        width: 36px;
        height: 36px;
        // background: rgba($color: #000000, $alpha: 1);
        background-size: 100% 100%;
        color: #000;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        z-index: 99;
        padding-bottom: 2px;
        box-sizing: border-box;
      }

      .center {
        position: absolute;
        width: 126px;
        height: 66px;
        background: rgba($color: #000000, $alpha: 0);
        border-radius: 50%;
        cursor: pointer;
        z-index: 99;
        box-sizing: border-box;
        left: 41.5%;
        top: 40%;
      }
    }
  }
}
</style>