import Guard from '../assets/images/guard.png';
import HeavyInfantry from '../assets/images/heavy_infantry.png';
import Scout from '../assets/images/scout.png';
import Militia from '../assets/images/millita.png';
import Knights from '../assets/images/knights.png';
import HeavyKnights from '../assets/images/heavy_knights.png';

import Wood from '../assets/images/resource_icon_1.png';
import Bricks from '../assets/images/resource_icon_2.png';
import Steel from '../assets/images/resource_icon_3.png';
import Food from '../assets/images/resource_icon_4.png';

export const infantry = [{
  name: 'Militia',
  desc: 'A basic unit with short training time and low cost, but relatively weak attack and defense attributes. It is suitable for early-game coordination with defenders.',
  img: Militia,
  barrackKind: 0,
  resource: [{
    img: Wood,
    name: 'wood',
    count: 120
  }, {
    img: Bricks,
    name: 'bricks',
    count: 100
  }, {
    img: Steel,
    name: 'steel',
    count: 150
  }, {
    img: Food,
    name: 'food',
    count: 30
  }]
}]

// , {
//   name: 'Defender',
//   desc: ' Primarily responsible for defense tasks, capable of effectively resisting infantry attacks, but has average defense capabilities against cavalry, slow movement speed, and weaker attack power.',
//   img: Guard,
//   barrackKind: 1,
//   resource: [{
//     img: Wood,
//     count: 20
//   }, {
//     img: Bricks,
//     count: 100
//   }, {
//     img: Steel,
//     count: 130
//   }, {
//     img: Food,
//     count: 160
//   }]
// }, {
//   name: 'Heavy Infantry',
//   desc: 'Possesses strong attack power and can launch powerful attacks, but has slow movement speed and high training costs.',
//   img: HeavyInfantry,
//   barrackKind: 2,
//   resource: [{
//     img: Wood,
//     count: 50
//   }, {
//     img: Bricks,
//     count: 150
//   }, {
//     img: Steel,
//     count: 160
//   }, {
//     img: Food,
//     count: 210
//   }]
// }

export const knights = [{
  name: 'Scouts',
  desc: `A reconnaissance unit operating in front of the main force, with fast movement speed and certain offensive capabilities, used for scouting the enemy's resources and troop numbers.`,
  img: Scout,
  barrackKind: 3,
  resource: [{
    img: Wood,
    count: 140
  }, {
    img: Bricks,
    count: 160
  }, {
    img: Steel,
    count: 20
  }, {
    img: Food,
    count: 80
  }]
}]

// , {
//   name: 'Cavalry',
//   desc: 'Characterized by fast movement and moderate attack power, they are the natural enemies of infantry. However, they require relatively high training costs and resources.',
//   img: Knights,
//   barrackKind: 4,
//   resource: [{
//     img: Wood,
//     count: 100
//   }, {
//     img: Bricks,
//     count: 550
//   }, {
//     img: Steel,
//     count: 440
//   }, {
//     img: Food,
//     count: 320
//   }]
// }, {
//   name: 'Heavy Cavalry',
//   desc: 'With the strongest attack power and decent movement speed, they can effectively withstand infantry attacks, making them the top force on the battlefield. Their only drawback is the extremely high cost of training and equipment.',
//   img: HeavyKnights,
//   barrackKind: 5,
//   resource: [{
//     img: Wood,
//     count: 70
//   }, {
//     img: Bricks,
//     count: 550
//   }, {
//     img: Steel,
//     count: 640
//   }, {
//     img: Food,
//     count: 800
//   }]
// }