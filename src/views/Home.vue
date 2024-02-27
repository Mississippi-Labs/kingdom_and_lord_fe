<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import { cityList, resource, castleList } from '../libs/data'
import CityList from '../components/CityList.vue'
import Message from '../components/Message.vue'
import Map from '../components/Map.vue'
import { useMessage } from 'naive-ui'
import { delay } from '../utils/index'

let interval = null

const cost = 100
const growthRate = 10
const house = 1000

const message = useMessage()

const menuIndex = ref(0)
const cityListData = ref(cityList)
const buildingList = ref([])
const blockHeight = ref(0)
const resourceData = ref(resource)
const castleListData = ref(castleList)

const upgrade = async (city) => {
  if (buildingList.value.length >= 2) {
    message.error('You can only build 2 buildings at the same time')
    return
  }
  await delay(400)
  let targetLevel = city.level + 1
  if (targetLevel * cost > resourceData.value.food || targetLevel * cost > resourceData.value.wood || targetLevel * cost > resourceData.value.steel || targetLevel * cost > resourceData.value.brick) {
    message.error('Resource is not enough')
    return
  }
  const block = targetLevel * 5
    buildingList.value.push({
      id: city.id,
      name: city.name,
      targetLevel: targetLevel,
      endBlock: blockHeight.value + block,
    })
    localStorage.setItem('buildingList', JSON.stringify(buildingList.value))
  resourceData.value = {
    food: resourceData.value.food - targetLevel * cost,
    wood: resourceData.value.wood - targetLevel * cost,
    steel: resourceData.value.steel - targetLevel * cost,
    brick: resourceData.value.brick - targetLevel * cost,
  }
  localStorage.setItem('resource', JSON.stringify(resourceData.value))
}

const getData = () => {
  let localBuildingList = localStorage.getItem('buildingList') || ''
  if (localBuildingList) {
    buildingList.value = JSON.parse(localBuildingList)
  }
  let localCityList = localStorage.getItem('cityList') || ''
  if (localCityList) {
    cityListData.value = JSON.parse(localCityList)
  }
  let localresource = localStorage.getItem('resource') || ''
  if (localresource) {
    resourceData.value = JSON.parse(localresource)
  }
  let localCastleList = localStorage.getItem('castleList') || ''
  if (localCastleList) {
    castleListData.value = JSON.parse(localCastleList)
  }
  let localBlockHeight = localStorage.getItem('blockHeight') || 0
  blockHeight.value = Number(localBlockHeight)
}

const getRate = (type) => {
  let rate = cityListData.value.filter(item => item.type === type).reduce((prev, next) => prev + (next.level + 1) * growthRate, 0)
  return rate
}

const updateResource = () => {
  let food = cityListData.value.filter(item => item.type === 'food').reduce((prev, next) => prev + (next.level + 1) * growthRate, 0)
  let wood = cityListData.value.filter(item => item.type === 'wood').reduce((prev, next) => prev + (next.level + 1) * growthRate, 0)
  let steel = cityListData.value.filter(item => item.type === 'steel').reduce((prev, next) => prev + (next.level + 1) * growthRate, 0)
  let brick = cityListData.value.filter(item => item.type === 'brick').reduce((prev, next) => prev + (next.level + 1) * growthRate, 0)
  // 仓库容量
  let warehouse = castleListData.value.filter(item => item.name === 'Warehouse').reduce((prev, next) => prev + (next.level + 1) * house, 0)
  let granary = castleListData.value.filter(item => item.name === 'Granary').reduce((prev, next) => prev + (next.level + 1) * house, 0)
  if (resourceData.value.food + food > granary) {
    food = granary - resourceData.value.food
  }
  if (resourceData.value.wood + wood > warehouse) {
    wood = warehouse - resourceData.value.wood
  }
  if (resourceData.value.steel + steel > warehouse) {
    steel = warehouse - resourceData.value.steel
  }
  if (resourceData.value.brick + brick > warehouse) {
    brick = warehouse - resourceData.value.brick
  }
  resourceData.value = {
    food: resourceData.value.food + food,
    wood: resourceData.value.wood + wood,
    steel: resourceData.value.steel + steel,
    brick: resourceData.value.brick + brick,
  }
  localStorage.setItem('resource', JSON.stringify(resourceData.value))
}

const getPercentage = (key, value) => {
  let warehouse = castleListData.value.filter(item => item.name === 'Warehouse').reduce((prev, next) => prev + (next.level + 1) * house, 0)
  let granary = castleListData.value.filter(item => item.name === 'Granary').reduce((prev, next) => prev + (next.level + 1) * house, 0)
  if (key === 'food') {
    return (value / granary) * cost
  } else {
    return (value / warehouse) * cost
  }
}

onBeforeMount(() => {
  getData()
  interval = setInterval(() => {
    blockHeight.value += 1
  }, 2000)
})
watch(() => blockHeight.value, (newVal) => {
  localStorage.setItem('blockHeight', newVal)
  updateResource()
  buildingList.value = buildingList.value.filter(item => {
    if (item.endBlock <= newVal) {
      cityListData.value = cityListData.value.map(city => {
        if (city.id === item.id) {
          city.level = item.targetLevel
        }
        return city
      })
      castleListData.value = castleListData.value.map(city => {
        if (city.id === item.id) {
          city.level = item.targetLevel
        }
        return city
      })
      return false
    }
    return true
  })
  localStorage.setItem('buildingList', JSON.stringify(buildingList.value))
  localStorage.setItem('cityList', JSON.stringify(cityListData.value))
  localStorage.setItem('castleList', JSON.stringify(castleListData.value))
})
</script>

<template>
  <div class="content">
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
          <div class="flex-sb"><p>{{ key }}</p><p>{{ item }}</p></div>
          <n-progress type="line" :percentage="getPercentage(key, item)" :show-indicator="false" style="margin-top: 8px;" />
        </div>
      </div>
    </div>

    <div class="main">
      <div style="flex: 1">
        <CityList v-if="menuIndex == 0" :cityList="cityListData" :buildingList="buildingList" :blockHeight="blockHeight"
          @upgrade="upgrade" />
        <CityList v-if="menuIndex == 1" :cityList="castleListData" :buildingList="buildingList" :blockHeight="blockHeight"
          @upgrade="upgrade" />
        <Message v-if="menuIndex == 3" />
        <Map v-if="menuIndex == 2" />
      </div>
      <div class="main-r">
        <n-card class="r-item" title="GrowthRate">
          <div class="r-content">food: {{ getRate('food') }}</div>
          <div class="r-content">wood: {{ getRate('wood') }}</div>
          <div class="r-content">steel: {{ getRate('steel') }}</div>
          <div class="r-content">brick: {{ getRate('brick') }}</div>
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
</template>

<style scoped lang="scss">
.content {
  padding: 0 30px;
  box-sizing: border-box;

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
    width: 800px;
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
