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
    const setupResult = await setup(dojoConfig())
    const config = setupResult.config
    let account = null
    account = await getAccount(config.rpcUrl)
    if (!account) {
      account = await createAccount(config.rpcUrl)
    }
    dojoContext.value = { account, setup: setupResult }
    const { Barn, CityBuilding, CityHall, UnderUpgrading, SpawnStatus, Warehouse, OuterCity } = setupResult.clientComponents
    const barn = useEntityQuery([Has(Barn)]);
    const cityBuilding = useEntityQuery([Has(CityBuilding)]);
    const cityHall = useEntityQuery([Has(CityHall)]);
    const underUpgrading = useEntityQuery([Has(UnderUpgrading)]);
    const spawnStatus = useEntityQuery([Has(SpawnStatus)]);
    const warehouse = useEntityQuery([Has(Warehouse)]);
    const outerCity = useEntityQuery([Has(OuterCity)]);

    watch(() => [barn, cityBuilding, cityHall, underUpgrading, spawnStatus, warehouse, outerCity], ([newBarnData, newCityBuildingData, newCityHallData, newUnderUpgradingData, newSpawnStatusData, newWarehouseData, newOuterCityData]) => {
      const barnData = newBarnData.value.map((entity) => {
        let data = getComponentValue(Barn, entity)
        data.player = getHexAddress(data.player)
        return data
      }).filter((barn) => barn.player === account.address)
      const cityBuildingData = newCityBuildingData.value.map((entity) => {
        let data = getComponentValue(CityBuilding, entity)
        data.player = getHexAddress(data.player)
        return data
      }).filter((cityBuilding) => cityBuilding.player === account.address)
      const cityHallData = newCityHallData.value.map((entity) => {
        let data = getComponentValue(CityHall, entity)
        data.player = getHexAddress(data.player)
        return data
      }).filter((cityHall) => cityHall.player === account.address)
      const underUpgradingData = newUnderUpgradingData.value.map((entity) => {
        let data = getComponentValue(UnderUpgrading, entity)
        data.player = getHexAddress(data.address)
        return data
      }).filter((underUpgrading) => underUpgrading.player === account.address)
      const spawnStatusData = newSpawnStatusData.value.map((entity) => {
        let data = getComponentValue(SpawnStatus, entity)
        data.player = getHexAddress(data.player)
        return data
      }).filter((spawnStatus) => spawnStatus.player === account.address)
      const warehouseData = newWarehouseData.value.map((entity) => {
        let data = getComponentValue(Warehouse, entity)
        data.player = getHexAddress(data.player)
        return data
      }).filter((warehouse) => warehouse.player === account.address)
      const outerCityData = newOuterCityData.value.map((entity) => {
        let data = getComponentValue(OuterCity, entity)
        data.player = getHexAddress(data.player)
        return data
      }).filter((outerCity) => outerCity.player === account.address)
      const dojoComponents = {
        barn: barnData,
        cityBuilding: cityBuildingData,
        cityHall: cityHallData,
        underUpgrading: underUpgradingData,
        spawnStatus: spawnStatusData,
        warehouse: warehouseData,
        outerCity: outerCityData
      }
      setDojoComponents(dojoComponents)
    }, { deep: true, immediate: true})
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}
onBeforeMount(() => {
  getData()
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
