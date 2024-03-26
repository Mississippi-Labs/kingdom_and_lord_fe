<script setup>
import { ref, watch, onBeforeMount, inject, onBeforeUnmount } from 'vue'
import { resource, upgradeData, buildingList } from '../libs/data'
import Modal from '../components/Modal.vue'
import Loading from '../components/Loading.vue'
import { useMessage } from 'naive-ui'
import { formatTime, getProof } from '../utils/index'
import { useGlobalStore } from '../hooks/globalStore.js'
import { RpcProvider } from "starknet";
import Nav from '../components/Nav.vue'
import { cityList } from '../libs/city.js'

let interval = null

const providerRPC = new RpcProvider({
  nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
});

const dojoContext = inject('DojoContext');

const { store } = useGlobalStore()
const message = useMessage()

const showLoading = ref(false)
const menuIndex = ref(0)
const cityListData = ref(cityList)
const blockHeight = ref(0)
const resourceData = ref(resource)
const growthRateData = ref({ resource })
const castleListData = ref([])
const buildingData = ref({})

const getBuildingList = () => {
  const { underUpgrading } = store.dojoComponents
  if (!underUpgrading) return []
  else return underUpgrading.filter(item => !item.is_finished)
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

const upgrade = async (data) => {
  console.log('upgrade', data)
  if (getBuildingList() >= 2) {
    message.error('You can only build 2 buildings at the same time')
    return
  }
  showLoading.value = true
  // const id = city.building_id
  const { startUpgrade, getUpgradeInfo } = dojoContext.setup.systemCalls
  const account = dojoContext.account
  // const requirement = await getUpgradeInfo(data.id, account.address)
  // const isCanUpgrade = await verify(requirement.required_resource)
  // if (!isCanUpgrade) {
  //   console.log("not enough resources")
  //   showLoading.value = false
  //   message.error('Not enough resources')
  //   return;
  // }
  try {
    // console.log(...data.resource)
    const proof = [
      '0x56e9e5ce79486d11d4079f6521d5de93bc3e474dc2cd647063fe45c22054ac8',
      '0x575978c19ae8821f17dcb09f2865515b661bb72486a758da18853b0208c5081',
      '0x751fea1cdd1b21696ae357f83c2b96fbd0a7891b053cdc652807c88320c942c',
      '0x352510f1269cea2ac10dab006a027dee2dcc6fc82676fbb5b862269d99528ee',
      '0x660a74333a6082be847d98d1779c25ab498eaf93ea998125db323a1bc0c8cc7',
      '0x53292aa62ac71f440a6c19786b359d3242844aed9effad78c0e7972ef409a1b',
      '0x59dc966df9f4d4b5a02fa4d584ce7280cc0c8633e411a3f92f558abe1ecc464',
      '0x6f083eb9dc40b555e9f8c6ed4529c2c5bfd33087c0f80701992b254230a0c32'
    ]
    await startUpgrade({ account, id: data.id, data: data.resource, proof })
    cityListData.value = cityListData.value.map(item => {
      if (item.buildingId === data.id) {
        item.img = buildingData.value.img
      }
      return item
    })
  } catch (error) {
    console.error('Failed to startUpgrade:', error)
    message.error('Failed to startUpgrade:' + error)
  }
  buildingData.value = {}
  showLoading.value = false
}

const createBuilding = (item) => {
  const { buildingKind, img } = item
  buildingData.value.buildingKind = buildingKind
  buildingData.value.img = img
  if (buildingKind === 5) {
    buildingData.value.resource = upgradeData.cityhall[0]
  } else if (buildingKind === 6) {
    buildingData.value.resource = upgradeData.warehouse[0]
  } else if (buildingKind === 7) {
    buildingData.value.resource = upgradeData.barn[0]
  } else if (buildingKind === 8) {
    buildingData.value.resource = upgradeData.barracks[0]
  }
  upgrade(buildingData.value)
}

  onBeforeMount(() => {
    getLastBlock()
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
      // cityListData.value = newVal.cityBuilding.sort((a, b) => a.building_id - b.building_id)
      // castleListData.value = [...newVal.cityHall, ...newVal.warehouse, ...newVal.barn]
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
      <Nav :resource="resourceData" />
      <div class="city">
        <div v-for="item in cityListData" :key="item.buildingId" class="city-item"
          :style="{ left: item.left, top: item.top }">
          <div v-if="!item.img" class="subgrade" @click="buildingData.id = item.buildingId"></div>
          <img v-else :src="item.img" alt="">
          <div v-if="item.img" class="upgrade-info">
            <div class="info-hd flex-center">
              <p class="flex-end">Center Building <span> - Level 9</span></p>
            </div>
            <div class="info-bd">
              <p>Upgrading to level 15 requires resources</p>
              <div class="flex-center-sb consume">
                <div class="flex-center">
                  <img src="../assets/images/consume.png" alt="">
                  <span>2000</span>
                </div>
                <div class="flex-center">
                  <img src="../assets/images/consume.png" alt="">
                  <span>2000</span>
                </div>
                <div class="flex-center">
                  <img src="../assets/images/consume.png" alt="">
                  <span>2000</span>
                </div>
                <div class="flex-center">
                  <img src="../assets/images/consume.png" alt="">
                  <span>2000</span>
                </div>
              </div>
              <div class="flex-center time">
                <img src="../assets/images/time.png" alt="">
                <span>5:00:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content flex-start">
        <div class="l">
          <div class="section"></div>
          <div class="section"></div>
          <div class="section-1">
            <div></div>
          </div>
          <div class="section-1">
            <div></div>
          </div>
        </div>
        <div class="m"></div>
        <div class="r">
          <div class="section">
            <div></div>
          </div>
          <div class="section-1">
            <div></div>
          </div>
          <div class="section-1">
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex-center spawn-wrap">
    <n-button type="primary" @click="spawnFun">Spawn</n-button>
  </div>
  <Modal v-if="buildingData.id" @close="buildingData = {}">
    <template v-slot:title>New Building</template>
    <div class="building-list">
      <div v-for="(item, index) in buildingList" :key="index" class="building-item">
        <div class="building-item-hd flex-center">{{ item.name }}</div>
        <div class="building-item-bd flex-center">
          <div class="building-item-desc">{{ item.desc }}</div>
          <div class="building-item-img">
            <img :src="item.img" alt="">
          </div>
        </div>
        <div class="building-item-resource flex-center-center">
          <div v-for="resource in item.resource" :key="resource.type" class="building-item-resource-item flex-center">
            <div class="icon flex-center-center"><img :src="resource.img" alt=""></div>
            <div class="amount">{{ resource.amount }}</div>
          </div>
        </div>
        <div class="building-item-time flex-center-center">
          <svg width="11" height="11" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5V11L15 13M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
              stroke="black" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ formatTime(item.time) }}</span>
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
      display: none;
      margin-top: 80px;
      padding: 0 48px;
      box-sizing: border-box;

      .l {
        flex: 0 0 310px;
        width: 310px;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        align-items: flex-end;

        .section {
          background: url(../assets/images/panel_1.png) no-repeat;
          background-size: 100% 100%;
          width: 310px;
          height: 110px;
          margin-bottom: $panelMB;
        }

        .section-1 {
          border: 12px solid transparent;
          border-image: url(../assets/images/panel.png) 36;
          border-radius: 20px;
          width: 248px;
          height: 188px;
          margin-bottom: $panelMB;

          div {
            width: 100%;
            height: 100%;
            background: #e8e8e8;
          }

          &:last-child {
            margin-bottom: 0;
          }
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
          height: 152px;
          border: 12px solid transparent;
          border-image: url(../assets/images/panel.png) 36;
          border-radius: 20px;
          margin-bottom: $panelMB;

          div {
            width: 100%;
            height: 100%;
            background: #e8e8e8;
          }
        }

        .section-1 {
          width: 100%;
          height: 92px;
          border: 12px solid transparent;
          border-image: url(../assets/images/panel.png) 36;
          border-radius: 20px;
          margin-bottom: $panelMB;

          div {
            width: 100%;
            height: 100%;
            background: #e8e8e8;
          }

          &:last-child {
            margin-bottom: 0;
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
    }

    .building-item-bd {
      margin-top: 10px;

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
