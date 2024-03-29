import { ec, num } from 'starknet'
import { poseidonHashMany } from '@scure/starknet';

export function computePoseidonHash(a, b) {
  return num.toHex(ec.starkCurve.poseidonHash(BigInt(a), BigInt(b)));
}

export function computePoseidonHashOnElements(data) {
  return num.toHex(poseidonHashMany(data.map((x) => BigInt(x))));
}

export function computePedersenHash(a, b) {
  return ec.starkCurve.pedersen(BigInt(a), BigInt(b));
}