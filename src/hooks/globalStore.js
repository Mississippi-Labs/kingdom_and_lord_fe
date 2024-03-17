import { reactive, toRaw } from "vue";

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
    lastBlock: 0
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


export const useGlobalStore = () => ({
  store,
  setDojoComponents,
  setLogs,
  setLastBlock
});
