<script setup>
import { ref, watch, onBeforeMount, inject, onBeforeUnmount } from 'vue'
import { resource } from '../libs/data'
import { upgradeData } from '../libs/test_data'
import Modal from '../components/Modal.vue'
import Loading from '../components/Loading.vue'
import { useMessage } from 'naive-ui'
import { formatTime, getProof, getUpgradeData } from '../utils/index'
import { useGlobalStore } from '../hooks/globalStore.js'
import { RpcProvider } from "starknet";
import Nav from '../components/Nav.vue'
import { innerBuildingOptions } from '../libs/building.js'
import OutBuilding from '../components/OutBuilding.vue'
import InnerBuilding from '../components/InnerBuilding.vue'
import CityInfo from '../components/CityInfo.vue'

let interval = null

const providerRPC = new RpcProvider({
  nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
});

const dojoContext = inject('DojoContext');

const { store, setInnerBuildingList } = useGlobalStore()
const message = useMessage()

const showLoading = ref(false)
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
    const event = await startUpgrade({ account, id: data.buildingId, data: resource, proof })
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
  console.log(data)
  underUpgradingData.value = data
}
const showCreateBuilding = (id) => {
  buildingData.value.buildingId = id
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
    <Nav :resource="resourceData" :storage="storage" />
    <InnerBuilding @createBuilding="showCreateBuilding" @upgradeBuilding="upgradeBuilding" />
    <OutBuilding @upgradeBuilding="upgradeBuilding" />
    <CityInfo :growthRateData="growthRateData" :blockHeight="blockHeight" />
  </div>
  <div v-else class="flex-center spawn-wrap">
    <n-button type="primary" @click="spawnFun">Spawn</n-button>
  </div>
  <Modal v-if="underUpgradingData.buildingId" @close="underUpgradingData = {}">
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
  <Modal v-if="buildingData.buildingId" @close="buildingData = {}">
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
.wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
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
