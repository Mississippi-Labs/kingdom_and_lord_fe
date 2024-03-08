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
    isSpawn: false
  }
});

const setDojoComponents = (components) => {
  store.dojoComponents = toRaw(components)
  if (components.spawnStatus.length) {
    store.state.isSpawn = true
  }
}


export const useGlobalStore = () => ({
  store,
  setDojoComponents
});
