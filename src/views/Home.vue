<script setup>
import { ref, watch, onBeforeMount, inject, onBeforeUnmount } from 'vue'
import { cityList, resource, castleList } from '../libs/data'
import CityList from '../components/CityList.vue'
import Message from '../components/Message.vue'
import Map from '../components/Map.vue'
import { useMessage } from 'naive-ui'
import { delay } from '../utils/index'
import { useGlobalStore } from '../hooks/globalStore.js'
import { RpcProvider } from "starknet";
import Loading from '../components/Loading.vue'

let interval = null

const providerRPC = new RpcProvider({
  nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
});

const dojoContext = inject('DojoContext');

const { store } = useGlobalStore()

const message = useMessage()

const showLoading = ref(false)
const menuIndex = ref(0)
const cityListData = ref([])
const buildingList = ref([])
const blockHeight = ref(0)
const resourceData = ref(resource)
const growthRateData = ref({ resource })
const castleListData = ref([])

watch(() => store.dojoComponents, (newVal) => {
  console.log('newVal', newVal)
  if (newVal) {
    cityListData.value = newVal.cityBuilding.sort((a, b) => a.building_id - b.building_id)
    castleListData.value = [...newVal.cityHall, ...newVal.warehouse, ...newVal.barn]
  }
}, { deep: true, immediate: true })

const spawnFun = async () => {
  console.log('spawnFun')
  console.log(dojoContext)
  showLoading.value = true
  let { spawn } = dojoContext.setup.systemCalls
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

const upgrade = async (city) => {
  if (buildingList.value.length >= 2) {
    message.error('You can only build 2 buildings at the same time')
    return
  }
  showLoading.value = true
  const id = city.building_id
  const { startUpgrade, getUpgradeInfo } = dojoContext.setup.systemCalls
  const account = dojoContext.account
  const requirement = await getUpgradeInfo(id, account.address)
  console.log('requirement', requirement)
  const isCanUpgrade = await verify(requirement.required_resource)
  console.log('isCanUpgrade', isCanUpgrade)
  if (!isCanUpgrade) {
    console.log("not enough resources")
    showLoading.value = false
    message.error('Not enough resources')
    return;
  }
  try {
    await startUpgrade({ account, id })
  } catch (error) {
    console.error('Failed to startUpgrade:', error)
    message.error('Failed to startUpgrade:' + error)
  }
  showLoading.value = false
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
  const { warehouse, barn } = store.dojoComponents
  const warehouseAmount = warehouse?.[0]?.max_storage
  const barnAmount = barn?.[0]?.max_storage
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

watch(() => blockHeight.value, (newVal) => {
  console.log('blockHeight', newVal)
  const { underUpgrading } = store.dojoComponents
  if (!underUpgrading) return
  buildingList.value = underUpgrading.filter(item => !item.is_finished)
  underUpgrading.forEach(async (item) => {
    if (item.end_time <= newVal && item.end_time !== 0 && item.is_finished != 1) {
      const { finishUpgrade } = dojoContext.setup.systemCalls
      const account = dojoContext.account
      await finishUpgrade({ account, id: item.upgrade_id })
    }
  })
}, {immediate: true})
</script>

<template>
  <div v-if="store.state.isSpawn" class="content">
    <div class="header flex-sb">
      <div class="logo">Kindoms Lords</div>
      <div class="menu flex">
        <div class="menu-item" :class="{ active: menuIndex == 0 }" @click="menuIndex = 0">Farms</div>
        <div class="menu-item" :class="{ active: menuIndex == 1 }" @click="menuIndex = 1">Castles</div>
        <div class="menu-item" :class="{ active: menuIndex == 2 }" @click="menuIndex = 2">Map</div>
        <div class="menu-item" :class="{ active: menuIndex == 3 }" @click="menuIndex = 3">Message</div>
      </div>
      <div class="wallet"></div>
    </div>
    <div class="resource">
      <div class="resource-item" v-for="(item, key) in resourceData" :key="item.id">
        <div class="item-name">
          <div class="flex-sb">
            <p>{{ key }}</p>
            <p>{{ item }} / {{getStorage(key, item)}}</p>
          </div>
          <n-progress type="line" :color="getPercentage(key, item) == 100 ? 'red' : ''"
            :percentage="getPercentage(key, item)" :show-indicator="false" style="margin-top: 8px;" />
        </div>
      </div>
    </div>

    <div class="main">
      <div style="width: 950px;flex: 0 0 950px;">
        <CityList v-if="menuIndex == 0" :cityList="cityListData" :buildingList="buildingList" :blockHeight="blockHeight"
          @upgrade="upgrade" />
        <CityList v-if="menuIndex == 1" :cityList="castleListData" :buildingList="buildingList"
          :blockHeight="blockHeight" @upgrade="upgrade" />
        <Message v-if="menuIndex == 3" />
        <Map v-if="menuIndex == 2" />
      </div>
      <div class="main-r">
        <n-card class="r-item" title="GrowthRate">
          <div class="r-content">food: {{ growthRateData.food }}</div>
          <div class="r-content">wood: {{ growthRateData.wood }}</div>
          <div class="r-content">steel: {{ growthRateData.steel }}</div>
          <div class="r-content">brick: {{ growthRateData.brick }}</div>
        </n-card>

        <n-card class="r-item" title="Alliance">
          <div class="r-content">Sponsor: Mask</div>
          <div class="r-content">Towns: 20</div>
        </n-card>

        <n-card class="r-item" title="Town Info">
          <div class="r-content">population: 253</div>
          <div class="r-content">loyalty: 100%</div>
        </n-card>

        <n-card class="r-item" title="Town List">
          <div class="r-content">Town Name 1</div>
          <div class="r-content">Town Name 2</div>
          <div class="r-content">Town Name 3</div>
        </n-card>
      </div>
    </div>
  </div>
  <div v-else class="flex spawn-wrap">
    <n-button type="primary" @click="spawnFun">Spawn</n-button>
  </div>
  <Loading v-if="showLoading" />
</template>

<style scoped lang="scss">
.spawn-wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
}
.content {
  padding: 0 30px;
  box-sizing: border-box;
  max-width: 1280px;
  margin: auto;

  .header {
    height: 100px;

    .logo {
      font-size: 24px;
      font-weight: 500;
      line-height: 1.2;
    }

    .menu {
      flex: 1;
      justify-content: center;
      margin-left: 20px;

      .menu-item {
        margin: 0 20px;
        font-size: 18px;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }

        &.active {
          color: #1890ff;
          font-weight: 500;

          &:hover {
            text-decoration: none;
          }
        }
      }
    }

    .wallet {
      width: 200px;
      flex: 0 0 200px;
      margin-left: 20px;
    }
  }

  .resource {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 980px;
    border-radius: 40px;
    border: 1px solid #E5E5E5;
    margin: auto;

    .resource-item {
      flex: 1;
      margin: 0 20px;
      font-size: 16px;
    }
  }

  .main {
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .main-r {
      flex: 0 0 220px;
      width: 250px;
      padding-top: 68px;
      box-sizing: border-box;

      .r-item {
        margin-bottom: 20px;

        .r-content {
          margin-bottom: 10px;
        }
      }
    }
  }
}

.flex {
  display: flex;
  align-items: center;
}

.flex-sb {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

<style>
.n-card.n-card--bordered {
  --n-padding-top: 10px !important;
  --n-padding-bottom: 8px !important;
  --n-padding-left: 10px !important;
  --n-padding-right: 10px !important;
}
</style>
