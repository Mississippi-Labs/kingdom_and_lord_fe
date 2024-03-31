import Guard from '../assets/images/guard.png';
import HeavyInfantry from '../assets/images/heavy_infantry.png';
import Scout from '../assets/images/scout.png';
import Millita from '../assets/images/millita.png';
import Knights from '../assets/images/knights.png';
import HeavyKnights from '../assets/images/heavy_knights.png';


export const infantry = [{
  name: 'Millita',
  desc: 'Militia are the most basic infantry unit, trained quickly and in large numbers.',
  img: Millita,
  barrackKind: 0
}, {
  name: 'Guard',
  desc: 'Guards are a more advanced infantry unit, with better armor and weapons than Militia.',
  img: Guard,
  barrackKind: 1
}, {
  name: 'Heavy Infantry',
  desc: 'Heavy Infantry are the most advanced infantry unit, with the best armor and weapons.',
  img: HeavyInfantry,
  barrackKind: 2
}]

export const knights = [{
  name: 'Light Cavalry',
  desc: 'Light Cavalry are the most basic cavalry unit, trained quickly and in large numbers.',
  img: Scout,
  barrackKind: 3
}, {
  name: 'Knights',
  desc: 'Knights are a more advanced cavalry unit, with better armor and weapons than Scouts.',
  img: Knights,
  barrackKind: 4
}, {
  name: 'Heavy Knights',
  desc: 'Heavy Knights are the most advanced cavalry unit, with the best armor and weapons.',
  img: HeavyKnights,
  barrackKind: 5
}]