<script setup>
import { ref, watch, onBeforeMount, inject, onBeforeUnmount } from 'vue'
import { cityList, resource, gameMap } from '../libs/data'
import CityList from '../components/CityList.vue'
import Message from '../components/Message.vue'
import Map from '../components/Map.vue'
import { useMessage } from 'naive-ui'
import { delay } from '../utils/index'
import { useGlobalStore } from '../hooks/globalStore.js'
import { RpcProvider } from "starknet";
import Loading from '../components/Loading.vue'
import Nav from '../components/Nav.vue'

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
const blockHeight = ref(0)
const resourceData = ref(resource)
const growthRateData = ref({ resource })
const castleListData = ref([])

watch(() => store.dojoComponents, (newVal) => {
  if (newVal) {
    cityListData.value = newVal.cityBuilding.sort((a, b) => a.building_id - b.building_id)
    castleListData.value = [...newVal.cityHall, ...newVal.warehouse, ...newVal.barn]
  }
}, { deep: true, immediate: true })

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

const upgrade = async (city) => {
  if (getBuildingList() >= 2) {
    message.error('You can only build 2 buildings at the same time')
    return
  }
  showLoading.value = true
  const id = city.building_id
  const { startUpgrade, getUpgradeInfo } = dojoContext.setup.systemCalls
  const account = dojoContext.account
  const requirement = await getUpgradeInfo(id, account.address)
  const isCanUpgrade = await verify(requirement.required_resource)
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
    <div class="bg">
      <div v-for="item in gameMap" class="col">
        <div class="col-item flex-center">
          <div v-for="i in item" class="col-item-img">
            <img src="../assets/images/bg.png" alt="">
            <div class="flex-center-center city-img">
              <img v-if="i == 'L' || i == 'LR'" src="../assets/images/2.png" alt="" class="">
              <img v-if="i == 'R' || i == 'LR'" src="../assets/images/3.png" alt="" class="">
              <img v-if="i >= 1 && i <= 4" src="../assets/images/A.png" alt="" class="">
              <img v-if="i >= 5 && i <= 8" src="../assets/images/B.png" alt="" class="">
              <img v-if="i >= 9 && i <= 12" src="../assets/images/C.png" alt="" class="">
              <img v-if="i >= 13 && i<= 18" src="../assets/images/D.png" alt="" class="">
              <img v-if="i == 19" src="../assets/images/E.png" alt="" class="">
              <img v-if="i == 20" src="../assets/images/F.png" alt="" class="">
              <img v-if="i == 21" src="../assets/images/G.png" alt="" class="">
              <p v-if="i >= 1 && i<= 21" class="flex-center-center">1</p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-for="i in 20" class="col">
        <div class="col-item"></div>
        <div class="col-item"></div>
      </div> -->
    </div>
    <div class="main">
      <Nav />
      <div class="content flex-start">
        <div class="l">
          <div class="section"></div>
          <div class="section"></div>
          <div class="section-1"></div>
          <div class="section-1"></div>
        </div>
        <div class="m"></div>
        <div class="r">
          <div class="section"></div>
          <div class="section-1"></div>
          <div class="section-1"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex-center spawn-wrap">
    <n-button type="primary" @click="spawnFun">Spawn</n-button>
  </div>
</template>

<style scoped lang="scss">
$panelMB: 40px;

.wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .bg {
    width: 100%;
    height: 100%;
    transform: scale(1);
    margin-left: -5vw;
    margin-top: -2vw;

    .col {
      width: 100vw;

      &:nth-child(2n) {
        margin-top: -4.33vw;
        margin-left: 3vw;
        height: 1.6vw;
      }

      .col-item {
        width: 100%;

        .col-item-img {
          width: 8vw;
          height: 6vw;
          flex: 0 0 6vw;
          position: relative;

          img {
            width: 100%;
            height: auto;
          }

          .city-img {
            position: absolute;
            top: 20px;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            font-size: 12px;
            color: aqua;

            img {
              width: 100%;
              height: 100%;
              position: absolute;
              cursor: pointer;
            }
            p {
              position: absolute;
              width: 20%;
              height: 20%;
              top: 0;
              bottom: 0;
              left: 0;
              right: 30%;
              border-radius: 50%;
              background: rgb(196, 186, 135);
              font-size: 12px;
              color: #000;
              margin: auto;
            }
          }
        }
      }
    }
  }

  .main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;

    .content {
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
          background: url(../assets/images/panel.png) no-repeat;
          background-size: 100% 100%;
          width: 248px;
          height: 188px;
          margin-bottom: $panelMB;

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
          background: url(../assets/images/panel_3.png) no-repeat;
          background-size: 100% 100%;
          margin-bottom: $panelMB;
        }

        .section-1 {
          width: 100%;
          height: 92px;
          background: url(../assets/images/panel_2.png) no-repeat;
          background-size: 100% 100%;
          margin-bottom: $panelMB;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }

}
</style>
