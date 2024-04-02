export const delay = (duration) => {
  return new Promise(resolve => setTimeout(resolve, duration));
}

// formatDate
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString();
}

export const formatTime = (time) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)
  return `${hours}:${minutes}:${seconds}`
}

export const getCityName = (id) => {
  if (id >= 0 && id <= 3) {
    return "Wood Factory"
  } else if (id >= 4 && id <= 7) {
    return "Steel Factory"
  } else if (id >= 8 && id <= 11) {
    return "Brick Factory"
  } else if (id >= 12 && id <= 17) {
    return "Farm"
  } else if (id == 18) {
    return "City Hall"
  } else if (id == 19) {
    return "Warehouse"
  } else if (id == 20) {
    return "Barn"
  }
}

import { upgradeData } from '../libs/test_data.js'
import { computePoseidonHash, computePoseidonHashOnElements } from './hash.js'
import { MerkleTree } from './merkle.ts'

const hash_posei = (data) => {
  return computePoseidonHashOnElements(data);
}

export const getProof = (arr) => {
  console.log("upgradeData: ", [...arr])
  const { wood, brick, steel, food, cityhall, warehouse, barn, barracks } = upgradeData
  const data = wood.concat(brick, steel, food, cityhall, warehouse, barn, barracks);
  const leaves = data.map((d) =>
    hash_posei(d)
  )
  const tree = new MerkleTree(leaves, computePoseidonHash);
  const h = hash_posei([...arr])
  const proof = tree.getProof(h);
  return proof
}

export const getUpgradeData = (buildingKind) => {
  if (buildingKind === 5) {
    return upgradeData.cityhall
  } else if (buildingKind === 6) {
    return upgradeData.warehouse
  } else if (buildingKind === 7) {
    return upgradeData.barn
  } else if (buildingKind === 8) {
    return upgradeData.barracks
  } else if (buildingKind === 1) {
    return upgradeData.wood
  } else if (buildingKind === 2) {
    return upgradeData.brick
  } else if (buildingKind === 3) {
    return upgradeData.steel
  } else if (buildingKind === 4) {
    return upgradeData.food
  }
}

// 验证是否可升级
export const checkUpgrade = (buildingKind, level, resource = {} ) => {
  let data = getUpgradeData(buildingKind)[level]
  let flag = false
  if (Object.keys(resource).length && resource.wood >= data[2] && resource.brick >= data[3] && resource.steel >= data[4] && resource.food >= data[5]) {
    flag = true
  }
  return flag
}

import LevelBg1 from '/images/level_btn_1.svg'
import LevelBg2 from '/images/level_btn_2.svg'
import LevelBg3 from '/images/level_btn_3.svg'
import LevelBg4 from '/images/level_btn_4.svg'
import LevelBg5 from '/images/level_btn_5.svg'
import LevelBg6 from '/images/level_btn_6.svg'

export const getLevelBg = (isUpgrading, building, resource = {}) => {
  if (isUpgrading) {
    const nextlevel = building?.level?.level ? building?.level?.level + 1 : 1

    if (Object.keys(resource).length && nextlevel < 20) {
      const isCanUpgrade = checkUpgrade(building.buildingKind, nextlevel, resource)
      if (isCanUpgrade) {
        return `url(${LevelBg4})`
      } else {
        return `url(${LevelBg5})`
      }
    } else {
      return `url(${LevelBg6})`
    }
  } else {
    const nextlevel = building?.level?.level || 0
    if (Object.keys(resource).length && nextlevel < 20) {
      const isCanUpgrade = checkUpgrade(building.buildingKind, nextlevel, resource)
      if (isCanUpgrade) {
        return `url(${LevelBg1})`
      } else {
        return `url(${LevelBg2})`
      }
    } else {
      return `url(${LevelBg3})`
    }
  }
}