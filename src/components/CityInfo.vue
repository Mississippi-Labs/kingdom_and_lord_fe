<script setup>
import { useGlobalStore } from '../hooks/globalStore.js'
import { innerBuildingOptions, outBuildingOptions  } from '../libs/building.js'
import { infantry, knights } from '../libs/barrack.js'

const props = defineProps({
  troopsData: {
    type: Object,
    default: {
      "Guard": 0,
      "Heavy Infantry": 0,
      "Heavy Knights": 0,
      "Knights": 0,
      "Millitia": 0,
      "Scouts": 0
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

const { store, setInnerBuildingList } = useGlobalStore()

const getTrainingList = () => {
  const { underTraining } = store.dojoComponents
  if (!underTraining) return []
  else return underTraining.filter(item => !item.is_finished)
}

const getTraining = (soldierKind) => {
  if (soldierKind > 2) {
    return knights.filter(e => e.barrackKind == soldierKind)[0]
  } else {
    return infantry.filter(e => e.barrackKind == soldierKind)[0]
  }
}

const getBuildingList = () => {
  const { underUpgrading } = store.dojoComponents
  if (!underUpgrading) return []
  else return underUpgrading.filter(item => !item.is_finished)
}
const getBuilding = (buildingKind) => {
  if (buildingKind >= 5) {
    return innerBuildingOptions.filter(e => e.buildingKind == buildingKind)[0]
  } else {
    return outBuildingOptions.filter(e => e.buildingKind == buildingKind)[0]
  }
}
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
        <div class="bd">
          <div class="bd-item flex-center-sb" v-for="(value, key) in troopsData">
            <div class="flex-center">
              <div class="img flex-center-center"><img src="../assets/images/tropps.png" alt=""></div>{{ key }}
            </div>{{ value }}
          </div>
        </div>
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
            <div>{{ item.end_time - blockHeight >= 0 ? item.end_time - blockHeight : 0 }}</div>
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
              <div class="img flex-center-center">
                <img :src="getTraining(item?.soldier_kind)?.img" alt="">
              </div>
              <span>{{ getTraining(item?.soldier_kind)?.name }}</span>
              <!-- <p class="lv">LV{{ item.target_level.level }}</p> -->
            </div>
            <div>{{ item.end_time - blockHeight >= 0 ? item.end_time - blockHeight : 0 }}</div>
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

          img {
            width: 18px;
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
    position: fixed;
    top: 154px;
    left: 48px;

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
    position: fixed;
    top: 154px;
    right: 48px;

    .section {
      width: 100%;

      .bd {
        .bd-item {
          .img {
            img {
              width: 24px;
            }
          }
        }
      }
    }
  }
}
</style>