<script setup>
import { ref, watch, onBeforeMount, h, toRaw } from 'vue'
import { setup } from './dojo/generated/setup.js'
import { dojoConfig } from '../dojoConfig.js'
import { getAccount, createAccount } from './utils/accountUtils.js'
import DojoProvider from './dojo/DojoProvider.vue';
import { useEntityQuery } from './utils/dojoUtils'
import { Has, getComponentValue } from "@dojoengine/recs";
import { useGlobalStore } from './hooks/globalStore.js'
import Loading from './components/Loading.vue'
import { toObject } from './utils/index.js'

const { setDojoComponents } = useGlobalStore()

const dojoContext = ref({
  account: null,
  setup: null
})

const getHexAddress = (address) => {
  const bn = BigInt(address);
  return '0x' + bn.toString(16);
}

const getData = async () => {
  try {
    const setupResult = await setup(dojoConfig)
    console.log('setupResult', setupResult)
    const config = setupResult.config
    let account = null
    account = await getAccount(config.rpcUrl)
    console.log(config)
    if (!account) {
      account = await createAccount(config.rpcUrl)
    }
    console.log('account', account)
    dojoContext.value = { account, setup: setupResult }
    const { Barn, BarnStorage, Barrack, BarrackUnderTraining, BarrackWaitingToTrain, BuildingAreaInfo, CityBuilding, CityHall, College, Config, UnderUpgrading, SpawnStatus, Warehouse, OuterCity, Troops, WaitingToUpgrade, WarehouseStorage, Stable, StableUnderTraining, StableWaitingToTrain, CityWall, Embassy } = setupResult.clientComponents
    const barn = useEntityQuery([Has(Barn)]);
    const cityBuilding = useEntityQuery([Has(CityBuilding)]);
    const cityHall = useEntityQuery([Has(CityHall)]);
    const cityWall = useEntityQuery([Has(CityWall)]);
    const embassy = useEntityQuery([Has(Embassy)]);
    const underUpgrading = useEntityQuery([Has(UnderUpgrading)]);
    const spawnStatus = useEntityQuery([Has(SpawnStatus)]);
    const warehouse = useEntityQuery([Has(Warehouse)]);
    const outerCity = useEntityQuery([Has(OuterCity)]);
    const barnStorage = useEntityQuery([Has(BarnStorage)]);
    const barrack = useEntityQuery([Has(Barrack)]);
    const buildingAreaInfo = useEntityQuery([Has(BuildingAreaInfo)]);
    const configData = useEntityQuery([Has(Config)]);
    const troops = useEntityQuery([Has(Troops)]);
    const waitingToUpgrade = useEntityQuery([Has(WaitingToUpgrade)]);
    const warehouseStorage = useEntityQuery([Has(WarehouseStorage)]);
    const barrackUnderTraining = useEntityQuery([Has(BarrackUnderTraining)]);
    const barrackWaitingToTrain = useEntityQuery([Has(BarrackWaitingToTrain)]);
    const stable = useEntityQuery([Has(Stable)]);
    const stableUnderTraining = useEntityQuery([Has(StableUnderTraining)]);
    const stableWaitingToTrain = useEntityQuery([Has(StableWaitingToTrain)]);
    const college = useEntityQuery([Has(College)]);

    watch(() => [barn, cityBuilding, cityHall, cityWall, underUpgrading, spawnStatus, warehouse, outerCity, barnStorage, barrack, buildingAreaInfo, configData, troops, waitingToUpgrade, warehouseStorage, barrackUnderTraining, barrackWaitingToTrain, stable, stableUnderTraining, stableWaitingToTrain, college, embassy], ([newBarnData, newCityBuildingData, newCityHallData, newCityWallData, newUnderUpgradingData, newSpawnStatusData, newWarehouseData, newOuterCityData, newBarnStorageData, newBarrackData, newBuildingAreaInfoData, newConfigData, newTroopsData, newWaitingToUpgradeData, newWarehouseStorageData, newBarrackUnderTrainingData, newBarrackWaitingToTrainData, newStableData, newStableUnderTrainingData, newStableWaitingToTrainData, newCollegeData, newEmbassyData]) => {
      const barnData = newBarnData.value.map((entity) => {
        let data = toObject(getComponentValue(Barn, entity))
        data.player = getHexAddress(data.player)
        data.buildingKind = 7
        return data
      }).filter((barn) => barn.player == account.address)
      const cityBuildingData = newCityBuildingData.value.map((entity) => {
        let data = toObject(getComponentValue(CityBuilding, entity))
        data.player = getHexAddress(data.player)
        return data
      }).filter((cityBuilding) => cityBuilding.player == account.address)
      const cityHallData = newCityHallData.value.map((entity) => {
        let data = toObject(getComponentValue(CityHall, entity))
        data.player = getHexAddress(data.player)
        data.buildingKind = 5
        return data
      }).filter((cityHall) => cityHall.player == account.address)
      const cityWallData = newCityWallData.value.map((entity) => {
        let data = toObject(getComponentValue(CityWall, entity))
        data.player = getHexAddress(data.player)
        data.buildingKind = 12
        return data
      }).filter((cityWall) => cityWall.player == account.address)

      const underUpgradingData = newUnderUpgradingData.value.map((entity) => {
        let data = toObject(getComponentValue(UnderUpgrading, entity))
        data.player = getHexAddress(data?.player)
        return data
      }).filter((underUpgrading) => underUpgrading.player == account.address)

      const spawnStatusData = newSpawnStatusData.value.map((entity) => {
        let data = toObject(getComponentValue(SpawnStatus, entity))
        data.player = getHexAddress(data.player)
        return data
      }).filter((spawnStatus) => spawnStatus.player == account.address)

      const warehouseData = newWarehouseData.value.map((entity) => {
        let data = toObject(getComponentValue(Warehouse, entity))
        data.player = getHexAddress(data.player)
        data.buildingKind = 6
        return data
      }).filter((warehouse) => warehouse.player == account.address)

      const outerCityData = newOuterCityData.value.map((entity) => {
        let data = toObject(getComponentValue(OuterCity, entity))
        data.player = getHexAddress(data.player)
        return data
      }).filter((outerCity) => outerCity.player == account.address)

      const barnStorageData = newBarnStorageData.value.map((entity) => {
        let data = toObject(getComponentValue(BarnStorage, entity))
        data.player = getHexAddress(data.player)
        return data
      }).filter((barnStorage) => barnStorage.player == account.address)

      const barrackData = newBarrackData.value.map((entity) => {
        let data = toObject(getComponentValue(Barrack, entity))
        data.player = getHexAddress(data.player)
        data.buildingKind = 8
        return data
      }).filter((barrack) => barrack.player == account.address)

      const buildingAreaInfoData = newBuildingAreaInfoData.value.map((entity) => {
        let data = toObject(getComponentValue(BuildingAreaInfo, entity))
        data.player = getHexAddress(data.player)
        return data
      }).filter((buildingAreaInfo) => buildingAreaInfo.player == account.address)

      const configDataData = newConfigData.value.map((entity) => {
        let data = toObject(getComponentValue(Config, entity))
        return data
      })

      const troopsData = newTroopsData.value.map((entity) => {
        let data = toObject(getComponentValue(Troops, entity))
        data.player = getHexAddress(data.player)
        return data
      }).filter((troops) => troops.player == account.address)

      const waitingToUpgradeData = newWaitingToUpgradeData.value.map((entity) => {
        let data = toObject(getComponentValue(WaitingToUpgrade, entity))
        data.player = getHexAddress(data.address)
        return data
      }).filter((barrack) => barrack.player == account.address)

      const warehouseStorageData = newWarehouseStorageData.value.map((entity) => {
        let data = toObject(getComponentValue(WarehouseStorage, entity))
        data.player = getHexAddress(data.player)
        return data
      }).filter((warehouseStorage) => warehouseStorage.player == account.address)

      const barrackUnderTrainingData = newBarrackUnderTrainingData.value.map((entity) => {
        let data = toObject(getComponentValue(BarrackUnderTraining, entity))
        data.player = getHexAddress(data.address)
        return data
      }).filter((barrackUnderTraining) => barrackUnderTraining.player == account.address)

      const barrackWaitingToTrainData = newBarrackWaitingToTrainData.value.map((entity) => {
        let data = toObject(getComponentValue(BarrackWaitingToTrain, entity))
        data.player = getHexAddress(data.address)
        return data
      }).filter((barrackWaitingToTrain) => barrackWaitingToTrain.player == account.address)

      const stableData = newStableData.value.map((entity) => {
        let data = toObject(getComponentValue(Stable, entity))
        data.player = getHexAddress(data.player)
        data.buildingKind = 9
        return data
      }).filter((stable) => stable.player == account.address)

      const stableUnderTrainingData = newStableUnderTrainingData.value.map((entity) => {
        let data = toObject(getComponentValue(StableUnderTraining, entity))
        data.player = getHexAddress(data.address)
        return data
      }).filter((stableUnderTraining) => stableUnderTraining.player == account.address)

      const stableWaitingToTrainData = newStableWaitingToTrainData.value.map((entity) => {
        let data = toObject(getComponentValue(StableWaitingToTrain, entity))
        data.player = getHexAddress(data.address)
        return data
      }).filter((stableWaitingToTrain) => stableWaitingToTrain.player == account.address)

      const collegeData = newCollegeData.value.map((entity) => {
        let data = toObject(getComponentValue(College, entity))
        data.player = getHexAddress(data.player)
        data.buildingKind = 10
        return data
      }).filter((college) => college.player == account.address)

      const embassyData = newEmbassyData.value.map((entity) => {
        let data = toObject(getComponentValue(Embassy, entity))
        data.player = getHexAddress(data.player)
        data.buildingKind = 11
        return data
      }).filter((embassy) => embassy.player == account.address)

      const dojoComponents = {
        barn: barnData,
        cityBuilding: cityBuildingData,
        cityHall: cityHallData,
        cityWall: cityWallData,
        underUpgrading: underUpgradingData,
        spawnStatus: spawnStatusData,
        warehouse: warehouseData,
        outerCity: outerCityData,
        barnStorage: barnStorageData,
        barrack: barrackData,
        buildingAreaInfo: buildingAreaInfoData,
        config: configDataData,
        troops: troopsData,
        waitingToUpgrade: waitingToUpgradeData,
        warehouseStorage: warehouseStorageData,
        barrackUnderTraining: barrackUnderTrainingData,
        barrackWaitingToTrain: barrackWaitingToTrainData,
        stable: stableData,
        stableUnderTraining: stableUnderTrainingData,
        stableWaitingToTrain: stableWaitingToTrainData,
        college: collegeData,
        embassy: embassyData
      }
      setDojoComponents(dojoComponents)
    }, { deep: true, immediate: true})
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}
onBeforeMount(() => {
  getData()
  const last = localStorage.getItem('last') || ''
  if (last != '4.29') {
    localStorage.clear()
    localStorage.setItem('last', '4.29')
  }
})

</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <DojoProvider :value=dojoContext>
        <router-view v-if="dojoContext.account"></router-view>
        <Loading v-else />
      </DojoProvider>
    </n-dialog-provider>
  </n-message-provider>
</template>
