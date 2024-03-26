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

import { upgradeData } from '../libs/data.js'
import { hash, num, merkle } from 'starknet'

const hash_posei = (data) => {
  return hash.computePoseidonHashOnElements(data);
}

export const getProof = (arr) => {
  const { wood, brick, steel, food, cityhall, warehouse, barn, barracks } = upgradeData
  const data = wood.concat(brick, steel, food, cityhall, warehouse, barn, barracks);
  const leaves = data.map((d) =>
    hash_posei(d)
  )

  const tree = new merkle.MerkleTree(leaves, hash.computePoseidonHash);

  const h = hash_posei(arr)
  const proof = tree.getProof(h);
  console.log("proof: ", proof)
  return proof
}