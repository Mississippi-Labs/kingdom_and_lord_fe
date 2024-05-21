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

const getSpeed = () => {
  let speed = 0
  const {millitia, guard, heavy_infantry, scouts, knights, heavy_knights} = ambushData.value
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

const createAmbushFun = async () => {
  console.log('createAmbushFun', dojoContext)
  const { createAmbush } = dojoContext.setup.systemCalls
  try {
    const address = dojoContext?.account?.address
    const distance = manhattanDistance(playerVillage.x, playerVillage.y, props.point.x, props.point.y)
    // 移动速度
    const speed = getSpeed()
    if (speed == 0) {
      message.error('Please select troops')
      return
    }
    // console.log('distance', distance, 'speed', speed)
    // return
    console.log('ambushData', ambushData.value)
    const time = Math.floor((distance / speed) * 100)
    const nonce = `${playerVillage.x}${playerVillage.y}`
    const {millitia, guard, heavy_infantry, scouts, knights, heavy_knights} = ambushData.value
    console.log('ambushData', [millitia, guard, heavy_infantry, scouts, knights, heavy_knights, props.point.x, props.point.y, time, nonce])
    ambushData.value.ambush_hash = await hashPosei([millitia, guard, heavy_infantry, scouts, knights, heavy_knights, props.point.x, props.point.y, time, nonce])
    console.log('ambushData', ambushData.value)
    
    await createAmbush(dojoContext.account, ambushData.value)
    let ambushList = localStorage.getItem('ambushList')
    const data = { time, nonce, target_x: props.point.x, target_y: props.point.y, ambush_hash: ambushData.value.ambush_hash }
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
  <Modal @close="close">
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
        <p class="value">{{point.x}}, {{point.y}}</p>
      </div>
      <div class="troops flex-center-sb">
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
      <div class="btn flex-center-center" @click="createAmbushFun">Build</div>
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
    margin-bottom: 8px;

    .key {
      font-size: 14px;
      width: 40px;
      margin-right: 10px;
    }

    .value {
      font-size: 14px;
      font-family: Chalkboard-Bold;
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
}
</style>