<script setup>
import { watch, ref } from 'vue'
import { innerBuildingOptions, outBuildingOptions, cityWall } from '../libs/building.js'
import { infantry, knights } from '../libs/barrack.js'
import { getBuildingList, getTrainingList } from '../utils/data'
import { useGlobalStore } from '../hooks/globalStore'

const { store } = useGlobalStore()

const props = defineProps({
  troopsData: {
    type: Object,
    default: {
      "Millitia": 0,
      "Guard": 0,
      "Heavy Infantry": 0,
      "Light Cavalry": 0,
      "Knights": 0,
      "Heavy Knights": 0
    }
  },
  growthRateData: {
    type: Object,
    default: {
      "wood": 0,
      "steel": 0,
      "brick": 0,
      "food": 0
    }
  },
  blockHeight: {
    type: Number,
    default: 0
  }
})

const troopsRef = ref({})

const getTraining = (soldierKind) => {
  if (soldierKind > 2) {
    return knights.filter(e => e.barrackKind == soldierKind)[0]
  } else {
    return infantry.filter(e => e.barrackKind == soldierKind)[0]
  }
}

const getBuilding = (buildingKind) => {
  if (buildingKind == 12) {
    return cityWall
  } else if (buildingKind >= 5) {
    return innerBuildingOptions.filter(e => e.buildingKind == buildingKind)[0]
  } else {
    return outBuildingOptions.filter(e => e.buildingKind == buildingKind)[0]
  }
}

const getAmbushList = () => {
  const { ambushInfo } = store.dojoComponents
  return ambushInfo.filter(e => e.end_time && !e.is_ambushed)
}

watch(() => props.troopsData, (newData) => {
  // 删除为0字段
  const troopsData = Object.keys(newData).reduce((acc, key) => {
    if (newData[key] !== 0) {
      acc[key] = newData[key]
    }
    return acc
  }, {})
  troopsRef.value = troopsData
}, {immediate: true})

</script>
<template>
  <div class="content flex-start">
    <div class="l">
      <!-- <div class="section-1"></div>
          <div class="section-1"></div> -->
      <div class="section">
        <div class="hd flex-center">Prodction Rate</div>
        <div class="bd">
          <div class="bd-item flex-center-sb">
            <div class="flex-center">
              <div class="img flex-center-center"><img src="../assets/images/resource_icon_4.png" alt=""></div>Food
            </div>{{ growthRateData.food }}
          </div>
          <div class="bd-item flex-center-sb">
            <div class="flex-center">
              <div class="img flex-center-center"><img src="../assets/images/resource_icon_1.png" alt=""></div>Wood
            </div>{{ growthRateData.wood }}
          </div>
          <div class="bd-item flex-center-sb">
            <div class="flex-center">
              <div class="img flex-center-center"><img src="../assets/images/resource_icon_3.png" alt=""></div>Steel
            </div>{{ growthRateData.steel }}
          </div>
          <div class="bd-item flex-center-sb">
            <div class="flex-center">
              <div class="img flex-center-center"><img src="../assets/images/resource_icon_2.png" alt=""></div>Brick
            </div>{{ growthRateData.brick }}
          </div>
        </div>
        <div class="ft"></div>
      </div>
      <div class="section">
        <div class="hd flex-center">Troops</div>
        <div v-if="Object.keys(troopsRef).length" class="bd">
          <div class="bd-item flex-center-sb" v-for="(value, key) in troopsRef">
            <div class="flex-center">
              <div class="img flex-center-center training-img">
                <img v-if="key == 'Militia'" src="../assets/images/millita.png" alt="">
                <img v-else-if="key == 'Guard'" src="../assets/images/guard.png" alt="">
                <img v-else-if="key == 'Heavy Infantry'" src="../assets/images/heavy_infantry.png" alt="">
                <img v-else-if="key == 'Light Cavalry'" src="../assets/images/scout.png" alt="">
                <img v-else-if="key == 'Knights'" src="../assets/images/knights.png" alt="">
                <img v-else-if="key == 'Heavy Knights'" src="../assets/images/heavy_knights.png" alt="">
              </div>{{ key }}
            </div>{{ value }}
          </div>
        </div>
        <div v-else class="no-data flex-center-center">No data</div>
        <div class="ft"></div>
      </div>
    </div>
    <div class="r">
      <div class="section">
        <div class="hd flex-center">Buildings</div>
        <div class="bd" v-if="getBuildingList().length">
          <div v-for="(item, index) in getBuildingList()" :key="index" class="bd-item flex-center-sb">
            <div class="flex-center">
              <div class="img flex-center-center">
                <img :src="getBuilding(item?.building_kind)?.img" alt="">
              </div>
              <span>{{ getBuilding(item?.building_kind)?.name }}</span>
              <p class="lv">LV{{ item.target_level.level }}</p>
            </div>
            <div>
              <span v-if="item.is_planned" style="color: #f17d00;">Waiting</span>
              <span v-else>{{ Number(item.end_time) - blockHeight >= 0 ? Number(item.end_time) - blockHeight : 0 }} blocks</span>
            </div>
          </div>
        </div>
        <div v-else class="no-data flex-center-center"> No Building data</div>
        <div class="ft"></div>
      </div>

      <div class="section">
        <div class="hd flex-center">Training</div>
        <div class="bd" v-if="getTrainingList().length">
          <div v-for="(item, index) in getTrainingList()" :key="index" class="bd-item flex-center-sb">
            <div class="flex-center">
              <div class="img flex-center-center training-img">
                <img :src="getTraining(item?.soldier_kind)?.img" alt="">
              </div>
              <span>{{ getTraining(item?.soldier_kind)?.name }}</span>
              <!-- <p class="lv">LV{{ item.target_level.level }}</p> -->
            </div>
            <div>
              <span v-if="item.is_planned" style="color: #f17d00;">Waiting</span>
              <span v-else>{{ Number(item.end_time) - blockHeight >= 0 ? Number(item.end_time) - blockHeight : 0 }} blocks</span>
              <!-- {{ item.is_planned ? 'waiting' : item.end_time - blockHeight >= 0 ? item.end_time - blockHeight : 0 }} -->
            </div>
          </div>
        </div>
        <div v-else class="no-data flex-center-center"> No training data</div>
        <div class="ft"></div>
      </div>
      <div class="section">
        <div class="hd flex-center">Ambush</div>
        <div class="bd" v-if="getAmbushList().length">
          <div v-for="(item, index) in getAmbushList()" :key="index" class="bd-item flex-center-sb">
            <div class="flex-center">
              <!-- <div class="img flex-center-center training-img">
                <img :src="getTraining(item?.soldier_kind)?.img" alt="">
              </div> -->
              <span>{{ item.start_x }}, {{ item.start_y }} -> {{ item.target_x }}, {{ item.target_y }} </span>
            </div>
            <div>
              <span>{{ Number(item.end_time) - blockHeight >= 0 ? Number(item.end_time) - blockHeight : 0 }} blocks</span>
            </div>
          </div>
        </div>
        <div v-else class="no-data flex-center-center"> No training data</div>
        <div class="ft"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$panelMB: 40px;
.content {
  box-sizing: border-box;
  position: relative;
  z-index: 999;
  max-width: 1440px;
  margin: auto;

  .section {
    font-family: 'Chalkboard-Bold';
    margin-bottom: 20px;

    .hd {
      height: 50px;
      background: url(../assets/images/dialog_hd.png) no-repeat;
      background-size: 100% 100%;
      padding: 2px 20px 0;
      box-sizing: border-box;
      font-size: 14px;
      font-family: 'Chalkboard-Bold';
    }

    .no-data {
      height: 50px;
      background: url(../assets/images/dialog_bd.png) no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      font-size: 14px;
      color: rgba($color: #000000, $alpha: .6);
    }

    .bd {
      background: url(../assets/images/dialog_bd.png) repeat;
      background-size: 100% auto;
      padding: 0 10px;
      box-sizing: border-box;

      .bd-item {
        border-bottom: 1px solid #cfcfcf;
        padding: 0 10px;
        height: 32px;
        box-sizing: border-box;
        font-size: 14px;

        &:last-child {
          border: none;
        }

        .img {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba($color: #000000, $alpha: .1);
          margin-right: 10px;
          &.training-img {
            img {
              width: auto !important;
              height: 26px;
            }
          }

          img {
            width: 22px;
            height: auto;
          }
        }

        .lv {
          color: #f17d00;
          margin-left: 8px;
        }
      }
    }

    .ft {
      background: url(../assets/images/dialog_ft.png) no-repeat;
      background-size: 100% 100%;
      height: 15px;
    }
  }

  .l {
    flex: 0 0 310px;
    width: 310px;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
    top: 154px;
    left: 10px;

    .section-1 {
      background: url(../assets/images/panel_1.png) no-repeat;
      background-size: 100% 100%;
      width: 310px;
      height: 110px;
      margin-bottom: $panelMB;
    }

    .section {
      width: 248px;
    }
  }

  .m {
    flex: 1;
  }

  .r {
    flex: 0 0 328px;
    width: 328px;
    position: absolute;
    top: 154px;
    right: 10px;

    .section {
      width: 100%;
    }
  }
}
</style>