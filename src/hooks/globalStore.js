import { reactive, toRaw } from "vue";
import { innerBuildingList } from '../libs/building.js'

const store = reactive({
  dojoComponents: {
    barn: null,
    cityBuilding: null,
    outerCity: null,
    warehouse: null,
    spawnStatus: null,
    underUpgrading: null,
    cityHall: null
  },
  state: {
    isSpawn: false,
    logs: localStorage.getItem('logs') ? JSON.parse(localStorage.getItem('logs')) : [],
    lastBlock: 0,
    innerBuildingList: localStorage.getItem('innerBuildingList') ? JSON.parse(localStorage.getItem('innerBuildingList')) : innerBuildingList,
  }
});

const setDojoComponents = (components) => {
  store.dojoComponents = toRaw(components)
  if (components.spawnStatus.length) {
    store.state.isSpawn = true
  }
}

const setLogs = (logs) => {
  store.state.logs = logs
  localStorage.setItem('logs', JSON.stringify(logs))
}

const setLastBlock = (block) => {
  store.state.lastBlock = block
}

const setInnerBuildingList = (list) => {
  store.state.innerBuildingList = list
  localStorage.setItem('innerBuildingList', JSON.stringify(list))
}


export const useGlobalStore = () => ({
  store,
  setDojoComponents,
  setLogs,
  setLastBlock,
  setInnerBuildingList
});
