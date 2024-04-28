import { isUpgrading, getBuildingList } from './data.js'
import { upgradeData } from '../libs/test_data.js'
import { computePoseidonHash, computePoseidonHashOnElements } from './hash.js'
import { MerkleTree } from './merkle.ts'

import LevelBg1 from '/images/level_btn_1.svg'
import LevelBg2 from '/images/level_btn_2.svg'
import LevelBg3 from '/images/level_btn_3.svg'
import LevelBg4 from '/images/level_btn_4.svg'
import LevelBg5 from '/images/level_btn_5.svg'
import LevelBg6 from '/images/level_btn_6.svg'

export const delay = (duration) => {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export const toObject = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => typeof value == 'bigint' ? value.toString() : value))
}

export const copy = async (text) => {
  if (!navigator.clipboard || window.top != window.self) {
    const input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  } else {
    navigator.clipboard.writeText(text)
  }
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

const hash_posei = (data) => {
  return computePoseidonHashOnElements(data);
}

export const getProof = (arr) => {
  const { wood, brick, steel, food, cityhall, warehouse, barn, barracks, stable, college, embassy, city_wall } = upgradeData
  const data = wood.concat(brick, steel, food, cityhall, warehouse, barn, barracks, stable, college, embassy, city_wall);
  const leaves = data.map((d) =>
    hash_posei(d)
  )
  const tree = new MerkleTree(leaves, computePoseidonHash);
  const h = hash_posei([...arr])
  const proof = tree.getProof(h);
  return proof
}

export const getUpgradeData = (buildingKind) => {
  if (buildingKind == 5) {
    return upgradeData.cityhall
  } else if (buildingKind == 6) {
    return upgradeData.warehouse
  } else if (buildingKind == 7) {
    return upgradeData.barn
  } else if (buildingKind == 8) {
    return upgradeData.barracks
  } else if (buildingKind == 1) {
    return upgradeData.wood
  } else if (buildingKind == 2) {
    return upgradeData.brick
  } else if (buildingKind == 3) {
    return upgradeData.steel
  } else if (buildingKind == 4) {
    return upgradeData.food
  } else if (buildingKind == 9) {
    return upgradeData.stable
  } else if (buildingKind == 10) {
    return upgradeData.college
  } else if (buildingKind == 11) {
    return upgradeData.embassy
  } else if (buildingKind == 12) {
    return upgradeData.city_wall
  }
}

export const getTime = (buildingKind, level = 0) => {
  return (getUpgradeData(buildingKind)[level][7] * 2)
}

export const getResourceArr = (buildingKind, level = 0) => {
  return getUpgradeData(buildingKind)[level].slice(2, 6)
}

// 验证是否可升级
export const checkResource = (buildingKind, level, resource = {} ) => {
  let data = getResourceArr(buildingKind, level)
  let flag = false
  if (Object.keys(resource).length && resource.wood >= data[0] && resource.brick >= data[1] && resource.steel >= data[2] && resource.food >= data[3]) {
    flag = true
  }
  return flag
}

// 判断是否可以升级
export const checkUpgrade = (buildingKind, level, resourceData) => {
  const buildingList = getBuildingList()
  if (buildingList.length >= 2) {
    return 4
  }
  
  if (buildingList.some(item => item.building_kind == buildingKind)) {
    return 1
  }

  if (!checkResource(buildingKind, level, resourceData)) {
    return 3
  }
}

export const getLevelBg = (buildingId, building, resource = {}) => {
  if (isUpgrading(buildingId)) {
    const nextlevel = Number(building?.level?.level) ? Number(building?.level?.level) + 1 : 1

    if (Object.keys(resource).length && nextlevel < 20) {
      const isCanUpgrade = checkResource(building.buildingKind, nextlevel, resource)
      if (isCanUpgrade) {
        return `url(${LevelBg4})`
      } else {
        return `url(${LevelBg5})`
      }
    } else {
      return `url(${LevelBg6})`
    }
  } else {
    if (getBuildingList().length >= 2) return `url(${LevelBg2})`
    const nextlevel = building?.level?.level || 0
    if (Object.keys(resource).length && nextlevel < 20) {
      const isCanUpgrade = checkResource(building.buildingKind, nextlevel, resource)
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