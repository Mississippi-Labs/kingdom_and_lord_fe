<script setup>
import { innerBuildingOptions, outBuildingList } from '../libs/building.js'
import { useGlobalStore } from '../hooks/globalStore.js'
import { formatTime, checkUpgrade, getUpgradeData } from '../utils/index'
import { useMessage } from 'naive-ui'

import LevelBg1 from '../assets/images/level_btn_1.svg'
import LevelBg2 from '../assets/images/level_btn_2.svg'
import LevelBg3 from '../assets/images/level_btn_3.svg'
import LevelBg4 from '../assets/images/level_btn_4.svg'
import LevelBg5 from '../assets/images/level_btn_5.svg'
import LevelBg6 from '../assets/images/level_btn_6.svg'


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

const isUpgrading = (buildingId) => {
  const { underUpgrading } = store.dojoComponents
  if (!underUpgrading) return false
  return underUpgrading.some(item => item.building_id === buildingId && !item.is_finished)
}

const upgradeBuilding = (item) => {
  if (isUpgrading(item.buildingId)) {
    message.error('Building is under upgrading')
    return
  }
  emit('upgradeBuilding', item)
}

const createBuilding = (id) => {
  emit('createBuilding', id)
}

const getResourceArr = (buildingKind, level) => {
  return getUpgradeData(buildingKind)[level].slice(2, 6)
}

const getTime = (buildingKind, level) => {
  return (getUpgradeData(buildingKind)[level][7] * 2)
}

const getBg = (buildingId) => {
  return `url(${LevelBg1})`
}

</script>
<template>
  <div class="inner-building">
    <div class="content">
      <img src="../assets/images/map_bg.jpg" class="bg" alt="">
    <div class="city">
      <div v-for="item in store.state.innerBuildingList" :key="item.buildingId" class="city-item"
        :style="{ left: item.left, top: item.top }">
        <div v-if="!item.img" class="subgrade" @click="createBuilding(item.buildingId)"></div>
        <div v-else class="building-item" @click="upgradeBuilding(item)">
          <img :src="item.img" alt="">
          <div class="level flex-center-center" :style="{'background-image': getBg(item.buildingId)}">{{ item?.level?.level || 0 }}</div>
        </div>
        <div v-if="item.img && item.level" class="upgrade-info">
          <div class="info-hd flex-center">
            <p class="flex-end">{{ item.name }}<span> - Level {{ item?.level?.level }}</span></p>
            <p v-if="isUpgrading(item.buildingId)" style="margin-left: .25em;">(under upgrading)</p>
          </div>
          <div class="info-bd">
            <p>Upgrading to level {{ item.level.level + 1 }} requires resources</p>
            <div class="flex-center-sb consume">
              <div v-for="(num, index) in getResourceArr(item.buildingKind, item.level.level)" class="flex-center">
                <img v-if="index == 0" src="../assets/images/resource_icon_1.png" alt="">
                <img v-else-if="index == 1" src="../assets/images/resource_icon_2.png" alt="">
                <img v-else-if="index == 2" src="../assets/images/resource_icon_3.png" alt="">
                <img v-else-if="index == 3" src="../assets/images/resource_icon_4.png" alt="">
                <!-- <img v-else-if="index == 4" src="../assets/images/resource_icon_5.png" alt=""> -->
                <span>{{ num }}</span>
              </div>
            </div>
            <div class="flex-center time">
              <img src="../assets/images/time.png" alt="">
              <span>{{ formatTime(getTime(item.buildingKind, item.level.level)) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
//@media screen 长宽比例
@media screen and (max-aspect-ratio: 8/5) {
  .content {
    position: relative;
    .bg {
      height: 100vh !important;
      width: auto !important;
      // height: 100vh;
      // width: auto;
    }
    .city-item {
      width: 9vh !important;
      height: 9vh !important;

      .subgrade {
        width: 6.6vh !important;
        height: 3.3vh !important;
      }
      .building-item {
        position: relative;
        display: inline-block;
        cursor: pointer;

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
        }
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

  .content {
    position: relative;
    display: inline-block;
  }

  .bg {
    width: 100%;
    // height: 100vh;
    // width: auto;
  }

  .city {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .city-item {
      width: 5.6vw;
      height: 5.6vw;
      position: absolute;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      // background: rgba($color: #000000, $alpha: .15);

      &:hover {
        .upgrade-info {
          display: block;
        }
      }

      .subgrade {
        position: absolute;
        width: 4vw;
        height: 2vw;
        border-radius: 50%;
        background: rgba($color: #000000, $alpha: .15);
        cursor: pointer;

        &:hover {
          background: rgba($color: #ffffff, $alpha: .3);
        }
      }

      img {
        width: 100%;
        height: auto;
        cursor: pointer;
        position: relative;
        z-index: 2;
      }

      .upgrade-info {
        position: absolute;
        width: 320px;
        height: 145px;
        background: rgba($color: #000000, $alpha: 0.8);
        display: none;
        z-index: 99;
        top: 80px;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 10px;

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
    }
  }
}
</style>