<script setup>
import { ref, watch, inject } from 'vue'
import Modal from '../Modal.vue'
import { useMessage } from 'naive-ui'
import { useGlobalStore } from '../../hooks/globalStore.js'
import { hash } from 'starknet'
import { soldiers } from '../../libs/test_data.js'

const dojoContext = inject('DojoContext');

const { store } = useGlobalStore()
const message = useMessage()

const playerVillage = store?.dojoComponents?.playerVillage?.[0] || {}

const props = defineProps({
  troopsData: {
    type: Object,
    default: {
      "Millitia": 0,
      "Guard": 0,
      "Heavy Infantry": 0,
      "Light Cavalry": 0,
      "Knights": 0,
      "Heavy Knights": 0
    }
  },
  point: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
})

const emit = defineEmits(['close'])

const tabIndex = ref(1)
const troopsRef = ref({})
const ambushType = ref(0)
const selectedData = ref({})
const showAmbushList = ref(false)
const targetPoint = ref({ x: 0, y: 0 })
const ambushData = ref({
  ambush_hash: '',
  millitia: 0,
  guard: 0,
  heavy_infantry: 0,
  scouts: 0,
  knights: 0,
  heavy_knights: 0
})

const close = () => {
  emit('close')
}

const hashPosei = async (data) => {
  return hash.computePoseidonHashOnElements(data);
}

const manhattanDistance = (x1, y1, x2, y2) => {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

const getAmbushList = () => {
  const { ambushInfo } = store.dojoComponents
  return ambushInfo.filter(e => e.end_time && e.is_ambushed && !e.is_revealed)
}

const getSpeed = (ambushData) => {
  let speed = 0
  const { millitia, guard, heavy_infantry, scouts, knights, heavy_knights } = ambushData
  if (guard > 0) {
    speed = soldiers[1][2]
  } else if (millitia > 0) {
    speed = soldiers[0][2]
  } else if (heavy_infantry > 0) {
    speed = soldiers[2][2]
  } else if (heavy_knights > 0) {
    speed = soldiers[5][2]
  } else if (knights > 0) {
    speed = soldiers[4][2]
  } else if (scouts > 0) {
    speed = soldiers[3][2]
  }
  return speed
}

const getBlocks = (item) => {
  const distance = manhattanDistance(item.target_x, item.target_y, targetPoint.value.x, targetPoint.value.y)
  const speed = getSpeed(item.army)
  const blocks = Math.floor((distance / speed) * 100)
  return blocks
}

const createAmbushFun = async () => {
  const { createAmbush } = dojoContext.setup.systemCalls
  try {
    const distance = manhattanDistance(playerVillage.x, playerVillage.y, targetPoint.value.x, targetPoint.value.y)
    // 移动速度
    const speed = getSpeed(ambushData.value)
    if (speed == 0) {
      message.error('Please select troops')
      return
    }
    // console.log('distance', distance, 'speed', speed)
    // return
    const time = Math.floor((distance / speed) * 100)
    const nonce = `${playerVillage.x}${playerVillage.y}`
    const { millitia, guard, heavy_infantry, scouts, knights, heavy_knights } = ambushData.value
    ambushData.value.ambush_hash = await hashPosei([millitia, guard, heavy_infantry, scouts, knights, heavy_knights, targetPoint.value.x, targetPoint.value.y, time, nonce])

    await createAmbush(dojoContext.account, ambushData.value)
    let ambushList = localStorage.getItem('ambushList')
    const data = { time, nonce, target_x: targetPoint.value.x, target_y: targetPoint.value.y, ambush_hash: ambushData.value.ambush_hash }
    if (ambushList) {
      ambushList = JSON.parse(ambushList)
      ambushList.push(data)
    } else {
      ambushList = [data]
    }
    localStorage.setItem('ambushList', JSON.stringify(ambushList))
  } catch (error) {
    console.error('Failed to createAmbush:', error)
    message.error('Failed to createAmbush:' + error)
  }
}

const revealHideFun = async () => {
  const { revealHide } = dojoContext.setup.systemCalls
  const { millitia, guard, heavy_infantry, scouts, knights, heavy_knights } = selectedData.value.army
  const time = getBlocks(selectedData.value)
  const nonce = `${playerVillage.x}${playerVillage.y}`
  const newHash = await hashPosei([millitia, guard, heavy_infantry, scouts, knights, heavy_knights, targetPoint.value.x, targetPoint.value.y, time, nonce])
  const args = {
    originHash: selectedData.value.ambush_hash,
    originX: selectedData.value.target_x,
    originY: selectedData.value.target_y,
    originTime: selectedData.value.time,
    originNonce: selectedData.value.nonce,
    newHash
  }
  try {
    await revealHide(dojoContext.account, args)
    let ambushList = localStorage.getItem('ambushList')
    const data = { time, nonce, target_x: targetPoint.value.x, target_y: targetPoint.value.y, ambush_hash: newHash }
    if (ambushList) {
      ambushList = JSON.parse(ambushList)
      ambushList.push(data)
    } else {
      ambushList = [data]
    }
    localStorage.setItem('ambushList', JSON.stringify(ambushList))
  } catch (error) {
    console.error('Failed to revealHide:', error)
    message.error('Failed to revealHide:' + error)
  }
}

const revealAttackFun = async () => {
  const { revealAttack } = dojoContext.setup.systemCalls
  const args = {
    hash: selectedData.value.ambush_hash,
    x: selectedData.value.target_x,
    y: selectedData.value.target_y,
    time: selectedData.value.time,
    nonce: selectedData.value.nonce,
    targetX: targetPoint.value.x,
    targetY: targetPoint.value.y,
    isRobbed: true
  }
  try {
    await revealAttack(dojoContext.account, args)
    let ambushList = localStorage.getItem('ambushList')
    if (ambushList) {
      ambushList = JSON.parse(ambushList)
      // 删除已经揭示的数据
      // ambushList = ambushList.filter(e => e.ambush_hash != selectedData.value.ambush_hash)
    }
    // localStorage.setItem('ambushList', JSON.stringify(ambushList))
  } catch (error) {
    console.error('Failed to revealAttack:', error)
    message.error('Failed to revealAttack:' + error)
  }
}

const send = async () => {
  if (ambushType.value == 0) {
    try {
      await createAmbushFun()
      close()
    } catch (error) {
      console.error('Failed to createAmbush:', error)
    }
  } else if (ambushType.value == 1) {
    try {
      await revealHideFun()
      close()
    } catch (error) {
      console.error('Failed to revealHide:', error)
    }
  } else if (ambushType.value == 2) {
    try {
      await revealAttackFun()
      close()
    } catch (error) {
      console.error('Failed to revealAttack:', error)
    }
  }
}

const changeAmbushType = (type) => {
  const globeLocation = store?.dojoComponents?.globeLocation
  if (type == 2 && !globeLocation.some(v => v.x == targetPoint.value.x && v.y == targetPoint.value.y)) {
    message.error('Please select a village to attack')
    return
  } else if ((type == 1 || type == 0) && globeLocation.some(v => v.x == targetPoint.value.x && v.y == targetPoint.value.y)) {
    message.error('Cannot ambush in a village')
    return
  }
  ambushType.value = type
}

watch(() => ambushType.value, (newData) => {
  if (newData != 0) {
    selectedData.value = getAmbushList()[0] || {}
  }
}, { immediate: true })

watch(() => props.point, (newData) => {
  const globeLocation = store?.dojoComponents?.globeLocation
  if (globeLocation.some(v => v.x == newData.x && v.y == newData.y)) {
    ambushType.value = 2
  }
  targetPoint.value = newData
}, { immediate: true })

watch(() => props.troopsData, (newData) => {
  // 删除为0字段
  const troopsData = Object.keys(newData).reduce((acc, key) => {
    if (+newData[key] > 0) {
      let accKey = key
      if (key == 'Militia') {
        accKey = 'millitia'
      } else if (key == 'Guard') {
        accKey = 'guard'
      } else if (key == 'Heavy Infantry') {
        accKey = 'heavy_infantry'
      } else if (key == 'Light Cavalry') {
        accKey = 'scouts'
      } else if (key == 'Knights') {
        accKey = 'knights'
      } else if (key == 'Heavy Knights') {
        accKey = 'heavy_knights'
      }
      acc[accKey] = newData[key]
    }
    return acc
  }, {})
  troopsRef.value = troopsData
}, { immediate: true })

</script>
<template>
  <Modal @close="close" :mainStyle="{'overflow-y': 'visible'}" :style="{'overflow': 'visible'}">
    <template v-slot:title>Rally Point</template>
    <div class="hd flex-center-center">
      <div class="img" @click="tabIndex = 0">
        <img v-show="tabIndex == 0" src="../../assets/images/point_btn_1.png" alt="">
        <img v-show="tabIndex != 0" src="../../assets/images/point_btn_d1.png" alt="">
        <p :style="{ color: tabIndex == 0 ? ' #FFB700' : '#fff' }">Overview</p>
      </div>
      <div class="img" @click="tabIndex = 1">
        <img v-show="tabIndex == 1" src="../../assets/images/point_btn_2.png" alt="">
        <img v-show="tabIndex != 1" src="../../assets/images/point_btn_d2.png" alt="">
        <p :style="{ color: tabIndex == 1 ? ' #FFB700' : '#fff' }">Send Troops</p>
      </div>
      <div class="img" @click="tabIndex = 2">
        <img v-show="tabIndex == 2" src="../../assets/images/point_btn_3.png" alt="">
        <img v-show="tabIndex != 2" src="../../assets/images/point_btn_d3.png" alt="">
        <p :style="{ color: tabIndex == 2 ? ' #FFB700' : '#fff' }">Simulator</p>
      </div>
    </div>
    <div class="bd">
      <div class="form-item flex-center">
        <p class="key">From</p>
        <p class="value">{{ playerVillage.x }}, {{ playerVillage.y }}</p>
      </div>
      <div class="form-item flex-center">
        <p class="key">To</p>
        <div class="point flex-center">
          <span>X</span><input type="number" v-model="targetPoint.x" />
          <span>,</span>
          <span>Y</span><input type="number" v-model="targetPoint.y" />
        </div>
      </div>
      <div class="type flex-center-sb">
        <div class="type-item flex-center" @click="changeAmbushType(0)">
          <img v-if="ambushType != 0" src="../../assets/images/check.svg" alt="">
          <img v-else src="../../assets/images/checked.svg" alt="">
          <span>Ambush</span>
        </div>
        <div class="type-item flex-center" @click="changeAmbushType(1)">
          <img v-if="ambushType != 1" src="../../assets/images/check.svg" alt="">
          <img v-else src="../../assets/images/checked.svg" alt="">
          <span>Re-Hide</span>
        </div>
        <div class="type-item flex-center" @click="changeAmbushType(2)">
          <img v-if="ambushType != 2" src="../../assets/images/check.svg" alt="">
          <img v-else src="../../assets/images/checked.svg" alt="">
          <span>Pillage</span>
        </div>
      </div>
      <div v-if="ambushType == 0" class="troops flex-center-sb">
        <div class="troops-item flex-center" v-for="(value, key) in troopsRef">
          <div class="img flex-center-center">
            <img v-if="key == 'millitia'" src="../../assets/images/millita.png" alt="">
            <img v-else-if="key == 'guard'" src="../../assets/images/guard.png" alt="">
            <img v-else-if="key == 'heavy_infantry'" src="../../assets/images/heavy_infantry.png" alt="">
            <img v-else-if="key == 'scouts'" src="../../assets/images/scout.png" alt="">
            <img v-else-if="key == 'knights'" src="../../assets/images/knights.png" alt="">
            <img v-else-if="key == 'heavy_knights'" src="../../assets/images/heavy_knights.png" alt="">
          </div>
          <div class="input flex-center">
            <input type="number" v-model="ambushData[key]" :max="troopsRef[key]" />
            <span>/ {{ troopsRef[key] }}</span>
          </div>
        </div>
      </div>
      <div v-else class="ambush-select" @click="showAmbushList = !showAmbushList">
        <div class="ambush-list" v-if="Object.keys(selectedData).length">
          <div class="ambush-item flex-center-sb">
            <div class="flex-center ambush-item-troops">
              <div class="ambush-troops-item flex-center" v-for="(value, key) in selectedData?.army" :key="key">
                <div class="img flex-center-center">
                  <img v-if="key == 'guard'" src="../../assets/images/guard.png" alt="">
                  <img v-else-if="key == 'millitia'" src="../../assets/images/millita.png" alt="">
                  <img v-else-if="key == 'heavy_infantry'" src="../../assets/images/heavy_infantry.png" alt="">
                  <img v-else-if="key == 'scouts'" src="../../assets/images/scout.png" alt="">
                  <img v-else-if="key == 'knights'" src="../../assets/images/knights.png" alt="">
                  <img v-else-if="key == 'heavy_knights'" src="../../assets/images/heavy_knights.png" alt="">
                </div>
                <span>{{ value }}</span>
              </div>

              <span>{{ selectedData?.target_x }}, {{ selectedData?.target_y }}</span>
            </div>
            <div class="time flex-center"><span v-if="Object.keys(selectedData).length != 0">{{ getBlocks(selectedData) }} blocks</span><img src="../../assets/images/icon_arrow.svg" alt="">
            </div>
          </div>
          <!-- </div> -->
        </div>
        <div v-show="showAmbushList" class="ambush-list ambush-absolute">
          <div class="ambush-item flex-center-sb" v-for="(item, index) in getAmbushList()" :key="index" @click="selectedData = item">
            <div class="flex-center ambush-item-troops">
              <div class="ambush-troops-item flex-center" v-for="(value, key) in item.army" :key="key">
                <div class="img flex-center-center">
                  <img v-if="key == 'guard'" src="../../assets/images/guard.png" alt="">
                  <img v-else-if="key == 'millitia'" src="../../assets/images/millita.png" alt="">
                  <img v-else-if="key == 'heavy_infantry'" src="../../assets/images/heavy_infantry.png" alt="">
                  <img v-else-if="key == 'scouts'" src="../../assets/images/scout.png" alt="">
                  <img v-else-if="key == 'knights'" src="../../assets/images/knights.png" alt="">
                  <img v-else-if="key == 'heavy_knights'" src="../../assets/images/heavy_knights.png" alt="">
                </div>
                <span>{{ value }}</span>
              </div>

              <span>{{ item.target_x }}, {{ item.target_y }}</span>
            </div>
            <div class="time flex-center"><span>{{ getBlocks(item) }} blocks</span><img src="../../assets/images/icon_arrow.svg" alt="">
            </div>
          </div>
          <!-- </div> -->
        </div>
      </div>
      <div class="btn flex-center-center" @click="send">Send</div>
    </div>
  </Modal>
</template>
<style lang="scss" scoped>
.hd {
  .img {
    position: relative;
    cursor: pointer;

    img {
      width: auto;
      height: 40px;
    }

    p {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 5px;
      box-sizing: border-box;
      color: #fff;
    }
  }
}

.bd {
  border: 1px solid rgb(157, 157, 157);
  box-sizing: border-box;
  border-radius: 10px;
  padding: 20px;
  margin: auto;
  margin-top: 20px;
  width: 490px;

  .form-item {
    margin-bottom: 16px;

    .key {
      font-size: 14px;
      width: 40px;
      margin-right: 10px;
    }

    .value {
      font-size: 14px;
      font-family: Chalkboard-Bold;
    }

    .point {
      font-size: 14px;

      input {
        width: 60px;
        height: 25px;
        font-size: 14px;
        margin-right: .25em;
        border: 1px solid #000;
        border-radius: 5px;
        outline: none;
      }

      span {
        font-size: 14px;
        margin-right: .5em;
      }

    }
  }

  .type {
    margin-top: 24px;
  }

  .type-item {
    cursor: pointer;

    img {
      width: 12px;
      height: 12px;
    }

    span {
      font-size: 12px;
      line-height: 1;
      margin-left: .5em;
    }
  }

  .troops {
    flex-wrap: wrap;

    .troops-item {
      width: 50%;
      margin-top: 20px;

      .img {
        width: 40px;
        height: 40px;
        background: #ECECEC;
        border-radius: 50%;

        img {
          width: 120%;
          height: 120%;
        }
      }

      .input {
        margin-left: 20px;

        input {
          height: 30px;
          width: 40px;
          font-size: 14px;
          // 去掉数字输入框的上下箭头
          -moz-appearance: textfield;

          &::-webkit-inner-spin-button,
          &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        }

        span {
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }
  }

  .ambush-select {
    margin-top: 40px;
    position: relative;
    .ambush-selected {
      height: 100px;
      border-radius: 20px;
      border: 1px solid #C3C3C3;
    }
  }

  .ambush-list {
    background: #fff;
    border: 1px solid #C3C3C3;
    border-radius: 20px;
    &.ambush-absolute {
      position: absolute;
      top: 120px;
      left: 0;
      right: 0;
      max-height: 220px;
      overflow: auto;
    }

    .ambush-item {
      height: 100px;
      border-bottom: 1px solid #f5f5f5;
      padding: 16px;
      padding-top: 6px;
      box-sizing: border-box;

      .ambush-item-troops {
        width: 300px;
        flex-wrap: wrap;

        .ambush-troops-item {
          margin-right: 15px;
          margin-top: 10px;
          width: 80px;
          flex: 0 0 70px;

          .img {
            width: 30px;
            height: 30px;
            background: #ECECEC;
            border-radius: 50%;

            img {
              width: 120%;
              height: 120%;
            }
          }

          span {
            margin-left: 10px;
            font-size: 14px;
          }
        }
      }

      .time {
        font-size: 14px;
        color: rgba($color: #000000, $alpha: .6);
        cursor: pointer;

        img {
          width: 8px;
          height: auto;
          margin-top: 4px;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>