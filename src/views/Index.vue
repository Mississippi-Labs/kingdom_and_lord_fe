<script setup>
import { ref, watch, onBeforeMount, inject, onBeforeUnmount } from 'vue'
import { resource } from '../libs/data'
import { upgradeData } from '../libs/test_data'
import Modal from '../components/Modal.vue'
import Loading from '../components/Loading.vue'
import { useMessage } from 'naive-ui'
import { formatTime, getProof } from '../utils/index'
import { useGlobalStore } from '../hooks/globalStore.js'
import { RpcProvider } from "starknet";
import Nav from '../components/Nav.vue'
import { innerBuildingOptions } from '../libs/building.js'

let interval = null

const providerRPC = new RpcProvider({
  nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
});

const dojoContext = inject('DojoContext');

const { store, setInnerBuildingList } = useGlobalStore()
const message = useMessage()

const showLoading = ref(false)
const menuIndex = ref(0)
const blockHeight = ref(0)
const resourceData = ref(resource)
const growthRateData = ref({ resource })
const buildingData = ref({})
const underUpgradingData = ref({})
const storage = ref({})

const isUpgrading = (buildingId) => {
  const { underUpgrading } = store.dojoComponents
  if (!underUpgrading) return false
  return underUpgrading.some(item => item.building_id === buildingId && !item.is_finished)
}

const getBuildingList = () => {
  const { underUpgrading } = store.dojoComponents
  if (!underUpgrading) return []
  else return underUpgrading.filter(item => !item.is_finished)
}

const getBuilding = (buildingKind) => {
  if (buildingKind >= 5) {
    return innerBuildingOptions.filter(e => e.buildingKind == buildingKind)[0]
  }
}

const spawnFun = async () => {
  showLoading.value = true
  const { spawn } = dojoContext.setup.systemCalls
  try {
    spawn({ account: dojoContext.account })
  } catch (error) {
    console.error('Failed to spawn:', error)
    message.error('Failed to spawn:' + error)
  }
  showLoading.value = false
}

const verify = async (requirement) => {
  if (Number(requirement.brick.amount) > resourceData.value.brick && Number(requirement.steel.amount) > resourceData.value.steel && Number(requirement.wood.amount) > resourceData.value.wood && Number(requirement.food.amount) > resourceData.value.food) {
    return false;
  }
  return true;
}

const getStorage = (key, value) => {
  const { warehouse, barn } = store.dojoComponents
  const warehouseAmount = warehouse?.[0]?.max_storage
  const barnAmount = barn?.[0]?.max_storage
  if (key === 'food') {
    return barnAmount
  } else {
    return warehouseAmount
  }
}

const getPercentage = (key, value) => {
  const { warehouseStorage, barnStorage } = store.dojoComponents
  const warehouseAmount = warehouseStorage?.[0]?.max_storage
  const barnAmount = barnStorage?.[0]?.max_storage
  if (key === 'food') {
    return (value / barnAmount) * 100
  } else {
    return (value / warehouseAmount) * 100
  }
}

const getLastBlock = async () => {
  const lastBlock = await providerRPC.getBlockLatestAccepted();
  blockHeight.value = lastBlock.block_number
}

const getData = async () => {
  if (!dojoContext?.setup?.systemCalls) return
  if (!store.state.isSpawn) return
  const { getResource, getGrowthRate } = dojoContext.setup.systemCalls
  const account = dojoContext.account
  const resource = await getResource(account.address)
  const growthRate = await getGrowthRate(account.address)
  // console.log('resource', resource, growthRate)
  resourceData.value = {
    food: Number(resource?.[3]?.amount),
    wood: Number(resource?.[0]?.amount),
    steel: Number(resource?.[1]?.amount),
    brick: Number(resource?.[2]?.amount),
  }
  growthRateData.value = {
    food: Number(growthRate?.[3]?.amount),
    wood: Number(growthRate?.[0]?.amount),
    steel: Number(growthRate?.[1]?.amount),
    brick: Number(growthRate?.[2]?.amount),
  }
}

const getUpgradeData = (buildingKind) => {
  if (buildingKind === 5) {
    return upgradeData.cityhall
  } else if (buildingKind === 6) {
    return upgradeData.warehouse
  } else if (buildingKind === 7) {
    return upgradeData.barn
  } else if (buildingKind === 8) {
    return upgradeData.barracks
  }
}

const upgrade = async (data) => {
  if (getBuildingList().length >= 2) {
    message.error('You can only build 2 buildings at the same time')
    return
  }
  showLoading.value = true
  const { startUpgrade } = dojoContext.setup.systemCalls
  const account = dojoContext.account
  try {
    let resource = getUpgradeData(data.buildingKind)[data.level.level]
    const proof = getProof(resource)
    const event = await startUpgrade({ account, id: data.id, data: resource, proof })
    console.log('event', event)
    if (event.length) {
      const innerBuildingList = store.state.innerBuildingList
      innerBuildingList.forEach(item => {
        if (item.buildingId === data.id) {
          item = Object.assign(item, data)
        }
      })
      setInnerBuildingList(innerBuildingList)
    }
  } catch (error) {
    console.error('Failed to startUpgrade:', error)
    message.error('Failed to startUpgrade:' + error)
  }
  buildingData.value = {}
  underUpgradingData.value = {}
  showLoading.value = false

}

const upgradeBuilding = async (data) => {
  if (isUpgrading(data.buildingId)) {
    message.error('Building is under upgrading')
    return
  }
  underUpgradingData.value = data
}
const createBuilding = (item) => {
  buildingData.value = Object.assign(buildingData.value, item)
  buildingData.value.level = { level: 0 }
  upgrade(buildingData.value)
}

const getResourceArr = (buildingKind, level) => {
  return getUpgradeData(buildingKind)[level].slice(2, 7)
}

const getTime = (buildingKind, level) => {
  return (getUpgradeData(buildingKind)[level][7] * 2)
}

const toObject = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value))
}

const setInnerBuildingListFun = (cityHall, warehouse, barn, barrack) => {
  cityHall.forEach(item => {
    item.buildingKind = 5
  })
  warehouse.forEach(item => {
    item.buildingKind = 6
  })
  barn.forEach(item => {
    item.buildingKind = 7
  })
  barrack.forEach(item => {
    item.buildingKind = 8
  })
  const underUpgrading = getBuildingList()
  underUpgrading.forEach(item => {
    item.buildingKind = item.building_kind
  })
  const list = [...cityHall, ...warehouse, ...barn, ...barrack, ...underUpgrading]
  const innerBuildingList = store.state.innerBuildingList
  list.forEach(item => {
    const itemData = innerBuildingOptions.filter(e => e.buildingKind == item.buildingKind)[0]
    innerBuildingList.forEach(e => {
      if (e.buildingId === item.building_id) {
        e = Object.assign(e, itemData, item)
      }
    })
  })
  console.log(innerBuildingList)
  setInnerBuildingList(toObject(innerBuildingList))
}

onBeforeMount(() => {
  getLastBlock()
  getData()
  interval = setInterval(() => {
    getLastBlock()
    if (dojoContext.setup) {
      getData()
    }
  }, 2000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})

watch(() => store.dojoComponents, (newVal) => {
  if (newVal) {
    console.log('newVal', newVal)
    const { barnStorage, warehouseStorage } = store.dojoComponents
    storage.value = {
      barn: barnStorage[0]?.max_storage,
      warehouse: warehouseStorage[0]?.max_storage
    }
    // cityListData.value = newVal.cityBuilding.sort((a, b) => a.building_id - b.building_id)
    const { cityHall, warehouse, barn, barrack } = newVal
    setInnerBuildingListFun(cityHall, warehouse, barn, barrack)
  }
}, { deep: true, immediate: true })

watch(() => blockHeight.value, (newVal) => {
  console.log('blockHeight', newVal)
  const { underUpgrading } = store.dojoComponents
  if (!underUpgrading) return
  underUpgrading.forEach(async (item) => {
    if (item.end_time <= newVal && item.end_time !== 0 && item.is_finished != 1) {
      const { finishUpgrade } = dojoContext.setup.systemCalls
      const account = dojoContext.account
      await finishUpgrade({ account, id: item.upgrade_id })
    }
  })
}, { immediate: true })
</script>

<template>
  <div v-if="store.state.isSpawn" class="wrap">
    <div class="main">
      <Nav :resource="resourceData" :storage="storage" />
      <div class="city">
        <div v-for="item in store.state.innerBuildingList" :key="item.buildingId" class="city-item"
          :style="{ left: item.left, top: item.top }">
          <div v-if="!item.img" class="subgrade" @click="buildingData.id = item.buildingId"></div>
          <img v-else :src="item.img" alt="" @click="upgradeBuilding(item)">
          <div v-if="item.img && item.level" class="upgrade-info">
            <div class="info-hd flex-center">
              <p class="flex-end">{{ item.name }}<span> - Level {{ item.level.level }}</span></p>
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
                  <img v-else-if="index == 4" src="../assets/images/resource_icon_5.png" alt="">
                  <span>{{num}}</span>
                </div>
              </div>
              <div class="flex-center time">
                <img src="../assets/images/time.png" alt="">
                <span>{{formatTime(getTime(item.buildingKind, item.level.level))}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content flex-start">
        <div class="l">
          <!-- <div class="section-1"></div>
          <div class="section-1"></div> -->
          <div class="section">
            <div class="hd flex-center">Prodction Rate</div>
            <div class="bd">
              <div class="bd-item flex-center-sb">
                <div class="flex-center">
                  <div class="img flex-center-center"><img src="../assets/images/resource_icon_4.png" alt=""></div>food
                </div>{{ growthRateData.food }}
              </div>
              <div class="bd-item flex-center-sb">
                <div class="flex-center">
                  <div class="img flex-center-center"><img src="../assets/images/resource_icon_1.png" alt=""></div>wood
                </div>{{ growthRateData.wood }}
              </div>
              <div class="bd-item flex-center-sb">
                <div class="flex-center">
                  <div class="img flex-center-center"><img src="../assets/images/resource_icon_3.png" alt=""></div>steel
                </div>{{ growthRateData.steel }}
              </div>
              <div class="bd-item flex-center-sb">
                <div class="flex-center">
                  <div class="img flex-center-center"><img src="../assets/images/resource_icon_2.png" alt=""></div>brick
                </div>{{ growthRateData.brick }}
              </div>
            </div>
            <div class="ft"></div>
          </div>
        </div>
        <div class="m"></div>
        <div class="r">
          <div class="section" v-if="getBuildingList().length">
            <div class="hd flex-center">Buildings</div>
            <div class="bd">
              <div v-for="(item, index) in getBuildingList()" :key="index" class="bd-item flex-center-sb">
                <div class="flex-center">
                  <div class="img flex-center-center">
                    <img :src="getBuilding(item?.building_kind).img" alt="">
                  </div>
                  <span>{{ getBuilding(item?.building_kind).name }}</span>
                  <p class="lv">LV{{ item.target_level.level }}</p>
                </div>
                <div>{{ item.end_time - blockHeight >= 0 ? item.end_time - blockHeight : 0 }}</div>
              </div>
            </div>
            <div class="ft"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex-center spawn-wrap">
    <n-button type="primary" @click="spawnFun">Spawn</n-button>
  </div>
  <Modal v-if="underUpgradingData.id" @close="underUpgradingData = {}">
    <template v-slot:title>
      <div class="flex-center"><img :src="underUpgradingData.img" style="width: 30px;margin-right: 10px" alt="">{{ underUpgradingData.name }} - level {{ underUpgradingData?.level?.level }}</div>
    </template>
    <div class="building-list">
      <div class="building-item">
        <div class="building-item-bd flex-center">
          <div class="building-item-desc">{{ underUpgradingData.desc }}</div>
        </div>
        <div class="building-item-resource flex-center-center">
          <div v-for="(resource, index) in getResourceArr(underUpgradingData.buildingKind, underUpgradingData?.level?.level)" :key="index" class="building-item-resource-item flex-center">
            <div class="icon flex-center-center">
              <img v-if="index == 0" src="../assets/images/resource_icon_1.png" alt="">
              <img v-else-if="index == 1" src="../assets/images/resource_icon_2.png" alt="">
              <img v-else-if="index == 2" src="../assets/images/resource_icon_3.png" alt="">
              <img v-else-if="index == 3" src="../assets/images/resource_icon_4.png" alt="">
              <img v-else-if="index == 4" src="../assets/images/resource_icon_5.png" alt="">
            </div>
            <div class="amount">{{ resource }}</div>
          </div>
        </div>
        <div class="btn flex-center-center" @click="upgrade(underUpgradingData)">Upgrade To Level {{ underUpgradingData.level.level + 1 }}</div>
        <div class="building-item-time flex-center-center">
          <svg width="11" height="11" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5V11L15 13M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
              stroke="black" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ formatTime(getTime(underUpgradingData.buildingKind, underUpgradingData?.level?.level)) }}</span>
        </div>
      </div>
    </div>
  </Modal>
  <Modal v-if="buildingData.id" @close="buildingData = {}">
    <template v-slot:title>New Building</template>
    <div class="building-list">
      <div v-for="(item, index) in innerBuildingOptions" :key="index" class="building-item">
        <div class="building-item-hd flex-center">{{ item.name }}</div>
        <div class="building-item-bd flex-center">
          <div class="building-item-desc">{{ item.desc }}</div>
          <div class="building-item-img">
            <img :src="item.img" alt="">
          </div>
        </div>
        <div class="building-item-resource flex-center-center">
          <div v-for="(resource, index) in getResourceArr(item.buildingKind, 0)" :key="index" class="building-item-resource-item flex-center">
            <div class="icon flex-center-center">
              <img v-if="index == 0" src="../assets/images/resource_icon_1.png" alt="">
              <img v-else-if="index == 1" src="../assets/images/resource_icon_2.png" alt="">
              <img v-else-if="index == 2" src="../assets/images/resource_icon_3.png" alt="">
              <img v-else-if="index == 3" src="../assets/images/resource_icon_4.png" alt="">
              <img v-else-if="index == 4" src="../assets/images/resource_icon_5.png" alt="">
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
        <div class="btn flex-center-center" @click="createBuilding(item)">Build</div>
      </div>
    </div>
  </Modal>
  <Loading v-if="showLoading" />
</template>

<style scoped lang="scss">
$panelMB: 40px;

.wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: url(../assets/images/map_bg.jpg) no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;

    .city {
      width: 50vw;
      height: 28vw;
      position: absolute;
      transform: translate(50%, 28%);

      // background: rgba($color: #000000, $alpha: 0.2);
      .city-item {
        width: 5.6vw;
        height: 5.6vw;
        position: absolute;
        display: flex;
        align-items: flex-end;
        justify-content: center;

        &:hover {
          .upgrade-info {
            display: block;
          }
        }

        .subgrade {
          position: absolute;
          width: 4vw;
          height: 2.4vw;
          border-radius: 50%;
          background: rgba($color: #000000, $alpha: .15);
          cursor: pointer;
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

    .content {
      margin-top: 80px;
      padding: 0 48px;
      box-sizing: border-box;

      .section {
        font-family: 'Chalkboard-Bold';

        .hd {
          height: 50px;
          background: url(../assets/images/dialog_hd.png) no-repeat;
          background-size: 100% 100%;
          padding: 2px 20px 0;
          box-sizing: border-box;
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
            font-size: 12px;

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
  }
}

.building-list {
  .building-item {
    width: 100%;
    border: 1px solid rgba($color: #000000, $alpha: .3);
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 10px;

    .building-item-hd {
      height: 40px;
      padding: 0 14px;
      color: #000000;
      font-size: 14px;
      font-family: 'Chalkboard-Bold';
      background: #e3e3e3;
      border-radius: 5px;
      margin-bottom: 10px;
    }

    .building-item-bd {

      .building-item-desc {
        padding: 0 8px;
        color: #000000;
        font-size: 12px;
        line-height: 1.5;
      }

      .building-item-img {
        flex: 0 0 120px;
        margin-left: 16px;

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .building-item-resource {
      margin-top: 20px;
      padding: 0 14px;
      box-sizing: border-box;
      flex-wrap: wrap;

      .building-item-resource-item {
        margin-right: 30px;
        margin-bottom: 10px;

        .icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #ececec;
          margin-right: 2px;

          img {
            width: 29px;
            height: auto;
          }
        }

        .amount {
          font-size: 12px;
          color: #000;
        }
      }
    }

    .building-item-time {
      margin-top: 10px;
      box-sizing: border-box;
      font-size: 12px;
      color: rgba($color: #000000, $alpha: .6);

      svg {
        margin-right: 4px;
        margin-top: 1px;
      }
    }
  }
}

.btn {
  width: 100%;
  height: 40px;
  background: url(../assets/images/btn_bg.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.mt10 {
  margin-top: 10px;
}
</style>
