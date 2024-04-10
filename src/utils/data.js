import { useGlobalStore } from '../hooks/globalStore.js'

const { store } = useGlobalStore()

export const isUpgrading = (buildingId) => {
  return store.dojoComponents.underUpgrading.some(item => item.building_id === buildingId && !item.is_finished) || store.dojoComponents.waitingToUpgrade.some(item => (item.building_id === buildingId && item.is_planned))
}

export const getBuildingList = () => {
  const { underUpgrading, waitingToUpgrade } = store.dojoComponents
  return underUpgrading.filter(e => !e.is_finished).concat(waitingToUpgrade.filter(item => item.is_planned))
}

export const getTrainingList = () => {
  const { barrackUnderTraining, barrackWaitingToTrain, stableUnderTraining, stableWaitingToTrain } = store.dojoComponents
  return barrackUnderTraining.filter(item => !item.is_finished).sort((a, b) => a.training_id - b.training_id).concat(stableUnderTraining.filter(item => !item.is_finished).sort((a, b) => a.training_id - b.training_id), barrackWaitingToTrain.filter(item => item.is_planned), stableWaitingToTrain.filter(item => item.is_planned))
}