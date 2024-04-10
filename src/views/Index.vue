<script setup>
import { ref, watch, onBeforeMount, inject, onBeforeUnmount } from 'vue'
import { resource } from '../libs/data'
import Loading from '../components/Loading.vue'
import { useMessage } from 'naive-ui'
import { getProof, getUpgradeData } from '../utils/index'
import { getBuildingList } from '../utils/data'
import { useGlobalStore } from '../hooks/globalStore.js'
import { RpcProvider } from "starknet";
import { innerBuildingOptions } from '../libs/building.js'
import Nav from '../components/Nav.vue'
import OutBuilding from '../components/OutBuilding.vue'
import InnerBuilding from '../components/InnerBuilding.vue'
import CityInfo from '../components/CityInfo.vue'
import UnderUpgradingDialog from '../components/dialog/UnderUpgradingDialog.vue'
import CreateBuildingDialog from '../components/dialog/CreateBuildingDialog.vue'

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
const troopsData = ref({
  "Millita": 0,
  "Guard": 0,
  "Heavy Infantry": 0,
  "Light Cavalry": 0,
  "Knights": 0,
  "Heavy Knights": 0
})

const toObject = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value))
}

const setInnerBuildingListFun = (cityHall, warehouse, barn, barrack, college, stable, embassy) => {
  const underUpgrading = getBuildingList()
  underUpgrading.forEach(item => {
    item.buildingKind = item.building_kind
  })
  const list = [...cityHall, ...warehouse, ...barn, ...barrack, ...college, ...stable, ...embassy, ...underUpgrading]
  const innerBuildingList = store.state.innerBuildingList
  list.forEach(item => {
    const itemData = innerBuildingOptions.filter(e => e.buildingKind == item.buildingKind)[0]
    innerBuildingList.forEach(e => {
      if (e.buildingId === item.building_id) {
        e = Object.assign(e, itemData, item)
      }
    })
  })
  setInnerBuildingList(toObject(innerBuildingList))
}

const getLastBlock = async () => {
  const lastBlock = await providerRPC.getBlockLatestAccepted();
  blockHeight.value = lastBlock.block_number
}

const getData = async () => {
  if (!dojoContext?.setup?.systemCalls) return
  if (!store.state.isSpawn) return
  const { getResource, getGrowthRate, getTroops, getTotalPopulation } = dojoContext.setup.systemCalls
  const account = dojoContext.account
  const resource = await getResource(account.address)
  const growthRate = await getGrowthRate(account.address)
  const troops = await getTroops(account.address)
  // const totalPopulation = await getTotalPopulation(account.address)
  // console.log('totalPopulation', totalPopulation)
  troopsData.value = {
    "Millita": Number(troops?.millitia),
    "Guard": Number(troops?.guard),
    "Heavy Infantry": Number(troops?.heavy_infantry),
    "Light Cavalry": Number(troops?.scouts),
    "Knights": Number(troops?.knights),
    "Heavy Knights": Number(troops?.heavy_knights)
  }
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

const closeDialog = () => {
  buildingData.value = {}
  underUpgradingData.value = {}
  showLoading.value = false
}

const upgrade = async (data) => {
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
  closeDialog()
}

const upgradeBuilding = async (data) => {
  const isUpgrading = getBuildingList().some(item => item.building_id === data.buildingId)
  if (isUpgrading) {
    message.error('Building is under upgrading')
    return
  }
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

const startTrainingFun = async (barrackKind) => {
  const { startTraining } = dojoContext.setup.systemCalls
  const account = dojoContext.account
  showLoading.value = true
  try {
    await startTraining({ account, barrackKind })
  } catch (error) {
    console.error('Failed to startTraining:', error)
    message.error('Failed to startTraining:' + error)
  }
  closeDialog()
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
  if (newVal && store.state.isSpawn) {
    console.log('newVal', newVal)
    const { barnStorage, warehouseStorage } = store.dojoComponents
    storage.value = {
      barn: barnStorage[0]?.max_storage,
      warehouse: warehouseStorage[0]?.max_storage
    }
    // cityListData.value = newVal.cityBuilding.sort((a, b) => a.building_id - b.building_id)
    const { cityHall, warehouse, barn, barrack, college, stable, embassy } = newVal
    setInnerBuildingListFun(cityHall, warehouse, barn, barrack, college, stable, embassy)
  }
}, { deep: true, immediate: true })

watch(() => blockHeight.value, (newVal) => {
  console.log('blockHeight', newVal)
  const { underUpgrading, barrackUnderTraining, stableUnderTraining } = store.dojoComponents
  const { finishUpgrade, finishTraining } = dojoContext.setup.systemCalls
  if (!underUpgrading) return
  underUpgrading.forEach(async (item) => {
    if (item.end_time <= newVal && item.end_time !== 0 && item.is_finished != 1) {
      console.log(1)
      const account = dojoContext.account
      let res = await finishUpgrade({ account })
      console.log('res', res)
    }
  })
  barrackUnderTraining.forEach(async (item) => {
    if (item.end_time <= newVal && item.end_time !== 0 && item.is_finished != 1) {
      const account = dojoContext.account
      await finishTraining({ account, isBarrack: true })
    }
  })

  stableUnderTraining.forEach(async (item) => {
    if (item.end_time <= newVal && item.end_time !== 0 && item.is_finished != 1) {
      const account = dojoContext.account
      await finishTraining({ account, isBarrack: false })
    }
  })
}, { immediate: true })
</script>

<template>
  <div v-if="store.state.isSpawn" class="wrap">
    <Nav :resource="resourceData" :storage="storage" />
    <InnerBuilding @createBuilding="showCreateBuilding" @upgradeBuilding="upgradeBuilding" :resource="resourceData" />
    <OutBuilding @upgradeBuilding="upgradeBuilding" :resource="resourceData" />
    <CityInfo :growthRateData="growthRateData" :blockHeight="blockHeight" :troopsData="troopsData" />
  </div>
  <div v-else class="flex-center spawn-wrap">
    <n-button type="primary" @click="spawnFun">Spawn</n-button>
  </div>
  <UnderUpgradingDialog :underUpgradingData="underUpgradingData" :resourceData="resourceData" @startTrainingFun="startTrainingFun" @upgrade="upgrade" @close="closeDialog" />
  <CreateBuildingDialog :buildingData="buildingData" :resourceData="resourceData"  @createBuilding="createBuilding" @close="closeDialog" />
  <Loading v-if="showLoading" />
</template>

<style scoped lang="scss">
.wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
