import CityJ from '../assets/images/cityJ.png'
import CityB from '../assets/images/cityB.png'
import CityD from '../assets/images/cityD.png'
import CityA from '../assets/images/cityA.png'
import CityH from '../assets/images/cityH.png'
import CityI from '../assets/images/cityI.png'
import CityC from '../assets/images/cityC.png'
import CityWall from '../assets/images/city_wall.png'

export const innerBuildingOptions = [{
  name: 'Central Building',
  desc: 'The main building of the village, also the residence of the chief architect, the higher the level of the central building, the faster the development speed of other buildings and resources, with a maximum reduction of 50% of the required time.',
  img: CityJ,
  buildingKind: 5
}, {
  name: 'Warehouse',
  desc: 'The warehouse stores produced resources like wood, bricks, and steel. Higher warehouse levels allow for more storage, and multiple warehouses can be built after constructing one at the highest level.',
  img: CityB,
  buildingKind: 6
}, {
  name: 'Granary',
  desc: 'The granary is a warehouse used to store crops. The higher the level of the granary, the more crops it can store. After constructing a granary at the highest level, additional granaries can be built.',
  img: CityD,
  buildingKind: 7
}, {
  name: 'Barracks',
  desc: 'The Barracks is where infantry is trained, with higher levels resulting in faster training speeds for infantry units.',
  img: CityA,
  buildingKind: 8
}, {
  name: 'Cavalry Barracks',
  desc: 'The Cavalry Barracks is where cavalry is trained, with higher levels resulting in faster training speeds for cavalry units.',
  img: CityH,
  buildingKind: 9
}, {
  name: 'Research Center',
  desc: 'The Research Center is a place for researching new unit types, with higher levels allowing the development of more advanced units.',
  img: CityI,
  buildingKind: 10
}, {
  name: 'Embassy',
  desc: 'The embassy is the residence of diplomats. When the embassy is at level 1, you can apply to join an alliance. When the embassy reaches level 3, you can create your own alliance.',
  img: CityC,
  buildingKind: 11
}]

export const cityWall = {
  name: 'City Wall',
  desc: `The city wall serves as the village's defensive structure, safeguarding villagers against external attacks and reducing resource plundering. The higher the level of the city wall, the better its defensive effectiveness.`,
  img: CityWall,
  buildingKind: 12,
  buildingId: 18
}

export const innerBuildingList = [{
  left: '30%',
  top: '35%',
  buildingId: 39,
  img: null
}, {
  left: '37%',
  top: '29%',
  buildingId: 19,
  img: null
}, {
  left: '43.5%',
  top: '32.5%',
  buildingId: 20,
  img: null
}, {
  left: '50.5%',
  top: '33.6%',
  buildingId: 21,
  img: null
}, {
  left: '48%',
  top: '26%',
  buildingId: 22,
  img: null
}, {
  left: '27%',
  top: '44%',
  buildingId: 23,
  img: null
}, {
  left: '32%',
  top: '48%',
  buildingId: 24,
  img: null
}, {
  left: '39%',
  top: '47%',
  buildingId: 25,
  img: null
}, {
  left: '37%',
  top: '37%',
  buildingId: 26,
  img: null
}, {
  left: '56%',
  top: '28%',
  buildingId: 27,
  img: null
}, {
  left: '42%',
  top: '60%',
  buildingId: 28,
  img: null
}, {
  left: '63%',
  top: '33%',
  buildingId: 29,
  img: null
}, {
  left: '67.5%',
  top: '44%',
  buildingId: 30,
  img: null
}, {
  left: '58%',
  top: '37%',
  buildingId: 31,
  img: null
}, {
  left: '34%',
  top: '57%',
  buildingId: 32,
  img: null
}, {
  left: '51%',
  top: '59%',
  buildingId: 33,
  img: null
}, {
  left: '46%',
  top: '51%',
  buildingId: 34,
  img: null
}, {
  left: '59%',
  top: '57%',
  buildingId: 35,
  img: null
}, {
  left: '64%',
  top: '53%',
  buildingId: 36,
  img: null
}, {
  left: '51%',
  top: '44%',
  buildingId: 37,
  img: null
}, {
  left: '58%',
  top: '47%',
  buildingId: 38,
  img: null
}]

import Wood from '../assets/images/resource_icon_1.png'
import Steel from '../assets/images/resource_icon_3.png'
import Brick from '../assets/images/resource_icon_2.png'
import Farm from '../assets/images/resource_icon_4.png'

export const outBuildingOptions = [{
  name: 'Forest',
  desc: 'The forest is where wood is produced. The higher the level of the forest, the higher the wood production per unit of time.',
  buildingKind: 1,
  img: Wood
}, {
  name: 'Mine',
  desc: 'The mine is where iron extracted. The higher the level of the mine, the higher the iron extraction per unit of time.',
  img: Steel,
  buildingKind: 3
}, {
  name: 'Mudhole',
  desc: 'The mudhole is where bricks are produced. The higher the level of the mudhole, the higher the brick production per unit of time.',
  img: Brick,
  buildingKind: 2
}, {
  name: 'Farm',
  desc: 'The farm is where grains are produced. The higher the level of the farm, the higher the grain production per unit of time.',
  img: Farm,
  buildingKind: 4
}]

export const outBuildingList = [{
  left: '36%',
  top: '35%',
  buildingId: 0,
  buildingKind: 1
}, {
  left: '43%',
  top: '34%',
  buildingId: 1,
  buildingKind: 1
}, {
  left: '40%',
  top: '52%',
  buildingId: 2,
  buildingKind: 1
}, {
  left: '49%',
  top: '56%',
  buildingId: 3,
  buildingKind: 1
}, {
  left: '36%',
  top: '28%',
  buildingId: 8,
  buildingKind: 3
}, {
  left: '53%',
  top: '33%',
  buildingId: 9,
  buildingKind: 3
}, {
  left: '63%',
  top: '35%',
  buildingId: 10,
  buildingKind: 3
}, {
  left: '58%',
  top: '28%',
  buildingId: 11,
  buildingKind: 3
}, {
  left: '36%',
  top: '60%',
  buildingId: 4,
  buildingKind: 2
}, {
  left: '44%',
  top: '68%',
  buildingId: 5,
  buildingKind: 2
}, {
  left: '60%',
  top: '64%',
  buildingId: 6,
  buildingKind: 2
}, {
  left: '56%',
  top: '56%',
  buildingId: 7,
  buildingKind: 2
}, {
  left: '26%',
  top: '52%',
  buildingId: 12,
  buildingKind: 4
}, {
  left: '29%',
  top: '34%',
  buildingId: 13,
  buildingKind: 4
}, {
  left: '60%',
  top: '43%',
  buildingId: 14,
  buildingKind: 4
}, {
  left: '68%',
  top: '45%',
  buildingId: 15,
  buildingKind: 4
}, {
  left: '45%',
  top: '26%',
  buildingId: 16,
  buildingKind: 4
}, {
  left: '32%',
  top: '42%',
  buildingId: 17,
  buildingKind: 4
}]
