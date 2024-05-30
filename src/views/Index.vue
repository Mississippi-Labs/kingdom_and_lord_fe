<script setup>
import { ref, watch, onBeforeMount, inject, onBeforeUnmount } from 'vue'
import { resource } from '../libs/data'
import Loading from '../components/Loading.vue'
import { useMessage } from 'naive-ui'
import { getProof, getUpgradeData, toObject } from '../utils/index'
import { getBuildingList } from '../utils/data'
import { useGlobalStore } from '../hooks/globalStore.js'
import { innerBuildingOptions } from '../libs/building.js'
import Nav from '../components/Nav.vue'
import OutBuilding from '../components/OutBuilding.vue'
import InnerBuilding from '../components/InnerBuilding.vue'
import CityInfo from '../components/CityInfo.vue'
import UnderUpgradingDialog from '../components/dialog/UnderUpgradingDialog.vue'
import CreateBuildingDialog from '../components/dialog/CreateBuildingDialog.vue'
import MapModal from '../components/MapModal.vue'

const dojoContext = inject('DojoContext');

const { store, setInnerBuildingList, setDojoComponents } = useGlobalStore()
const message = useMessage()

const showLoading = ref(false)
const blockHeight = ref(0)
const resourceData = ref(resource)
const growthRateData = ref({ resource })
const buildingData = ref({})
const underUpgradingData = ref({})
const storage = ref({})
const troopsData = ref({
  "Militia": 0,
  "Guard": 0,
  "Heavy Infantry": 0,
  "Light Cavalry": 0,
  "Knights": 0,
  "Heavy Knights": 0
})

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
      if (e.buildingId == item.building_id) {
        e = Object.assign(e, itemData, item)
      }
    })
  })
  setInnerBuildingList(toObject(innerBuildingList))
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
  const { army } = troops
  troopsData.value = {
    "Militia": Number(army?.millitia),
    "Guard": Number(army?.guard),
    "Heavy Infantry": Number(army?.heavy_infantry),
    "Light Cavalry": Number(army?.scouts),
    "Knights": Number(army?.knights),
    "Heavy Knights": Number(army?.heavy_knights)
  }
  resourceData.value = {
    food: Number(resource?.[3]?.amount),
    wood: Number(resource?.[0]?.amount),
    steel: Number(resource?.[2]?.amount),
    brick: Number(resource?.[1]?.amount),
  }
  growthRateData.value = {
    food: Number(growthRate?.[3]?.amount),
    wood: Number(growthRate?.[0]?.amount),
    steel: Number(growthRate?.[2]?.amount),
    brick: Number(growthRate?.[1]?.amount),
  }
  // console.log('growthRateData', growthRate)
}

const spawnFun = async () => {
  showLoading.value = true
  const { spawn, createVillageConfirm, createVillageReveal } = dojoContext.setup.systemCalls
  try {
    // console.log('spawn', dojoContext.account)
    await createVillageConfirm({ account: dojoContext.account })
    await spawn({ account: dojoContext.account })
    await createVillageReveal({ account: dojoContext.account })
    showLoading.value = false
  } catch (error) {
    console.error('Failed to spawn:', error)
    message.error('Failed to spawn:' + error)
    showLoading.value = false
  }
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
        if (item.buildingId == data.id) {
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
  const isUpgrading = getBuildingList().some(item => item.building_id == data.buildingId)
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

const startTrainingFun = async (barrackKind, amount) => {
  if (!amount) {
    message.error('Please input amount')
    return
  }
  const { startTraining } = dojoContext.setup.systemCalls
  const account = dojoContext.account
  showLoading.value = true
  try {
    await startTraining({ account, barrackKind, amount })
  } catch (error) {
    console.error('Failed to startTraining:', error)
    message.error('Failed to startTraining:' + error)
  }
  closeDialog()
}

const updateAmbustList = () => {
  const ambushList = localStorage.getItem('ambushList')
  const dojoComponents = store.dojoComponents
  const { ambushInfo } = dojoComponents
  if (ambushList && ambushInfo?.length) {
    const list = JSON.parse(ambushList)

    ambushInfo.forEach(data => {
      list.forEach(e => {
        if (e.ambush_hash == data.ambush_hash) {
          data.end_time = Number(data.created_time) + Number(e.time)
          data = Object.assign(data, e)
        }
      });
      if (data.end_time && data.end_time < blockHeight.value) {
        data.is_ambushed = true
      } else {
        data.is_ambushed = false
      }
    })
    dojoComponents.ambushInfo = ambushInfo
    setDojoComponents(dojoComponents)
  }
}

onBeforeMount(() => {
  getData()
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
  getData()
  updateAmbustList()
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

watch(() => store.state.blockHeight, (newVal) => {
  if (newVal) {
    blockHeight.value = newVal
  }
}, { immediate: true })
</script>

<template>
  <div v-if="store.state.isSpawn" class="wrap">
    <Nav :resource="resourceData" :storage="storage" :address="dojoContext?.account?.address || ''" />
    <InnerBuilding @createBuilding="showCreateBuilding" @upgradeBuilding="upgradeBuilding" :resource="resourceData" />
    <OutBuilding @upgradeBuilding="upgradeBuilding" :resource="resourceData" />
    <CityInfo :growthRateData="growthRateData" :blockHeight="blockHeight" :troopsData="troopsData" />
    <MapModal :troopsData="troopsData" />
  </div>
  <div v-else class="flex-center spawn-wrap">
    <n-button type="primary" size="large" @click="spawnFun">Create Account</n-button>
  </div>
  <UnderUpgradingDialog :underUpgradingData="underUpgradingData" :resourceData="resourceData"
    @startTrainingFun="startTrainingFun" @upgrade="upgrade" @close="closeDialog" />
  <CreateBuildingDialog :buildingData="buildingData" :resourceData="resourceData" @createBuilding="createBuilding"
    @close="closeDialog" />
  <Loading v-if="showLoading" />
</template>

<style scoped lang="scss">
.wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.spawn-wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
  font-size: 24px;
  flex-direction: column;

  p {
    margin-bottom: 40px;
  }
}
</style>
