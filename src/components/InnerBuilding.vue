<script setup>
import { ref, onMounted, nextTick} from 'vue'
import { useGlobalStore } from '../hooks/globalStore.js'
import { getLevelBg } from '../utils/index'
import { useMessage } from 'naive-ui'
import { isUpgrading } from '../utils/data'
import { cityWall } from '../libs/building.js'
import BuildingInfo from './BuildingInfo.vue'
import { getBuildingList } from '../utils/data'

const emit = defineEmits(['upgradeBuilding', 'createBuilding'])
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

const message = useMessage()
const { store } = useGlobalStore()

const building = ref(Object.assign(cityWall, store.dojoComponents.cityWall[0]))
const style = ref({ left: 0, top: 0 })
const show = ref(false)

const hasCityWall = () => {
  return store.dojoComponents.cityWall.length > 0 || getBuildingList().filter(item => item.building_id == 18).length > 0
}

const upgradeBuilding = (item) => {
  if (isUpgrading(item.buildingId)) {
    message.error('Building is under upgrading')
    return
  }
  if (item.buildingId == 18) {
    const cityWall = store.dojoComponents.cityWall[0]
    if (cityWall) {
      item = Object.assign(item, cityWall)
    } else {
      createBuilding(18)
      return
    }
  }
  emit('upgradeBuilding', item)
}

const createBuilding = (id) => {
  emit('createBuilding', id)
}

const getBg = (buildingId) => {
  let building
  if (buildingId == 18) {
    building = store.dojoComponents.cityWall[0]
    building.buildingKind = 12
  } else {
    building = store.state.innerBuildingList.find(item => item.building_id == buildingId)
  }
  if (!building) return ''
  return getLevelBg(buildingId, building, props.resource)
}

const showInfo = (e, item) => {
  if (item.buildingId == 18) {
    item = Object.assign(item, store.dojoComponents.cityWall[0])
  }
  if (!item.level) item.level = { level: 0 }
  building.value = item
  style.value = { left: e.clientX + 'px', top: e.clientY + 'px' }
  show.value = true
}

const hiddenInfo = () => {
  show.value = false
}

</script>
<template>
  <div class="inner-building flex-center-center">
    <div class="content">
      <img src="../assets/images/map_bg.jpg" class="bg" alt="">
      <div class="city">
        <div class="city-wall" @click="upgradeBuilding(cityWall)">
          <div class="city-wall-inner" @click.stop></div>
          <img v-if="hasCityWall()" src="../assets/images/city_wall.png" alt="" class="city-wall-img" @mouseover="showInfo($event, cityWall)" @mouseout="hiddenInfo" />
          <!-- <div class="level flex-center-center" :style="{ 'background-image': getBg(18) }">{{1}}</div> -->
        </div>
        <div v-for="item in store.state.innerBuildingList" :key="item.buildingId" class="city-item"
          :style="{ left: item.left, top: item.top }" >
          <div v-if="!item.img" class="subgrade" @click="createBuilding(item.buildingId)"></div>
          <div v-else class="building-item" @click="upgradeBuilding(item)" @mouseover="showInfo($event, item)" @mouseout="hiddenInfo">
            <img :src="item.img" alt="">
            <div class="level flex-center-center" :style="{ 'background-image': getBg(item.buildingId) }">{{
          item?.level?.level || 0 }}</div>
          </div>
        </div>
      </div>
      <BuildingInfo v-show="show" :building="building" :style="style" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
//@media screen 最大宽度
@media screen and (min-width: 1440px) {
  .content {
    position: relative;

    .bg {
      height: auto !important;
      width: 1440px !important;
      // height: 100vh;
      // width: auto;
    }

    .city-item {
      width: calc(1440px * 0.056) !important;
      height: calc(1440px * 0.056) !important;

      .subgrade {
        width: calc(1440px * 0.04) !important;
        height: calc(1440px * 0.02) !important;
      }
    }
    .city-wall {
      width: calc(1440px * 0.495) !important;
      height: calc(1440px * 0.495 * 0.584) !important;
      .city-wall-img {
        width: calc(1440px * 0.495) !important;
        height: auto !important;
      }
    }
  }
}

.inner-building {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  z-index: 2;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(../assets/images/map_bg.jpg) no-repeat center center;
    background-size: cover;
    filter: blur(10px);
    z-index: 1;
  }
  

  .content {
    position: relative;
    display: inline-block;
    z-index: 2;
    // max-width: 1440px;
    // min-width: 100vw;
    // background: #fff;
    // margin: auto;
  }

  .bg {
    // width: 100%;
    height: 100vh;
    width: auto;
  }

  .city {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    .city-wall {
      position: absolute;
      left: 25%;
      top: 28%;
      z-index: 1;
      cursor: pointer;
      height: 46.2vh;
      width: calc(46.2vh * 1.7);
      .city-wall-inner {
        position: absolute;
        width: 88%;
        height: 80%;
        top: -10px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 50%;
        cursor: initial;
      }
      .city-wall-img {
        width: auto;
        height: 46.2vh;
      }
    }

    .city-item {
      // width: 5.6vw;
      // height: 5.6vw;
      width: 9vh;
      height: 9vh;
      position: absolute;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      // z-index: 2;
      // background: rgba($color: #000000, $alpha: .15);

      .level {
        position: absolute;
        width: 24px;
        height: 24px;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        border-radius: 50%;
        z-index: 10;
        margin: auto;
        background-size: 100% 100%;
        font-size: 12px;
        color: #000;
        padding-bottom: 2px;
        z-index: 3;
      }

      .subgrade {
        position: absolute;
        // width: 4vw;
        // height: 2vw;
        width: 6.6vh;
        height: 3.3vh;
        border-radius: 50%;
        background: rgba($color: #000000, $alpha: .15);
        cursor: pointer;
        z-index: 2;

        &:hover {
          background: rgba($color: #ffffff, $alpha: .3);
        }
      }

      .building-item {
        position: relative;
        display: inline-block;
        cursor: pointer;
      }

      img {
        width: 100%;
        height: auto;
        cursor: pointer;
        position: relative;
        z-index: 2;
      }
    }
  }
}
</style>