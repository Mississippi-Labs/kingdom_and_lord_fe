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
    innerBuildingList: innerBuildingList,
    menuIndex: 0,
    showMap: false
  }
});

const setMenuIndex = (index) => {
  store.state.menuIndex = index
}

const setShowMap = (status) => {
  store.state.showMap = status
}

const setDojoComponents = (components) => {
  console.log(components)
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
}


export const useGlobalStore = () => ({
  store,
  setDojoComponents,
  setLogs,
  setLastBlock,
  setInnerBuildingList,
  setMenuIndex,
  setShowMap
});
