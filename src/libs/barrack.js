import Guard from '../assets/images/guard.png';
import HeavyInfantry from '../assets/images/heavy_infantry.png';
import Scout from '../assets/images/scout.png';
import Millita from '../assets/images/millita.png';
import Knights from '../assets/images/knights.png';
import HeavyKnights from '../assets/images/heavy_knights.png';


export const infantry = [{
  name: 'Millita',
  desc: 'A basic unit with short training time and low cost, but relatively weak attack and defense attributes. It is suitable for early-game coordination with defenders.',
  img: Millita,
  barrackKind: 0
}, {
  name: 'Defender',
  desc: ' Primarily responsible for defense tasks, capable of effectively resisting infantry attacks, but has average defense capabilities against cavalry, slow movement speed, and weaker attack power.',
  img: Guard,
  barrackKind: 1
}, {
  name: 'Heavy Infantry',
  desc: 'Possesses strong attack power and can launch powerful attacks, but has slow movement speed and high training costs.',
  img: HeavyInfantry,
  barrackKind: 2
}]

export const knights = [{
  name: 'Scouts',
  desc: `A reconnaissance unit operating in front of the main force, with fast movement speed and certain offensive capabilities, used for scouting the enemy's resources and troop numbers.`,
  img: Scout,
  barrackKind: 3
}, {
  name: 'Cavalry',
  desc: 'Characterized by fast movement and moderate attack power, they are the natural enemies of infantry. However, they require relatively high training costs and resources.',
  img: Knights,
  barrackKind: 4
}, {
  name: 'Heavy Cavalry',
  desc: 'With the strongest attack power and decent movement speed, they can effectively withstand infantry attacks, making them the top force on the battlefield. Their only drawback is the extremely high cost of training and equipment.',
  img: HeavyKnights,
  barrackKind: 5
}]