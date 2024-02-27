<script setup>
import { ref, onBeforeMount } from 'vue'

// 10*10的地图
const map = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
const colors = [
  '255, 0, 0',
  '0, 255, 0',
  '0, 0, 255',
  '255, 255, 0',
  '0, 255, 255'
]

const villages = ref([])
const mapData = ref(map)

onBeforeMount(() => {
  // 随机生成5个村庄 并且上下左右是该村庄的势力范围 并且不跟其他的势力范围重合
  for (let i = 0; i < 5; i++) {
    let x = Math.floor(Math.random() * 10)
    let y = Math.floor(Math.random() * 10)
    while (map[x][y] !== 0) {
      x = Math.floor(Math.random() * 10)
      y = Math.floor(Math.random() * 10)
    }
    map[x][y] = i + 1
    villages.value.push({ x, y, id: i + 1 })
    if (x - 1 >= 0) {
      map[x - 1][y] = i + 1
    }
    if (x + 1 < 10) {
      map[x + 1][y] = i + 1
    }
    if (y - 1 >= 0) {
      map[x][y - 1] = i + 1
    }
    if (y + 1 < 10) {
      map[x][y + 1] = i + 1
    }
  }

  // 随机生成10个怪兽 不覆盖在村庄上
  for (let i = 0; i < 10; i++) {
    let x = Math.floor(Math.random() * 10)
    let y = Math.floor(Math.random() * 10)
    while (map[x][y] !== 0) {
      x = Math.floor(Math.random() * 10)
      y = Math.floor(Math.random() * 10)
    }
    map[x][y] = -1
  }

  // 随机生成8个山脉 不覆盖在村庄和怪兽上
  for (let i = 0; i < 8; i++) {
    let x = Math.floor(Math.random() * 10)
    let y = Math.floor(Math.random() * 10)
    while (map[x][y] !== 0) {
      x = Math.floor(Math.random() * 10)
      y = Math.floor(Math.random() * 10)
    }
    map[x][y] = -2
  }

  let localMap = localStorage.getItem('map') || ''
  let localVillages = localStorage.getItem('villages') || ''
  if (localVillages) {
    villages.value = JSON.parse(localVillages)
  } else {
    localStorage.setItem('villages', JSON.stringify(villages.value))
  }
  if (localMap) {
    mapData.value = JSON.parse(localMap)

  } else {
    mapData.value = map
    localStorage.setItem('map', JSON.stringify(map))
  }
})

const getBg = (col) => {
  if (col > 0) {
    return { background: `rgba(${colors[col - 1]}, 0.2)` }
  } else {
    return ''
  }
}
</script>

<template>
  <div>
    <div class="map">
      <div class="row" v-for="(row, rowIndex) in mapData" :key="rowIndex">
        <div class="col" v-for="(col, colIndex) in row" :key="colIndex">
          <div class="item" :style="getBg(col)">
            <span v-if="col === -1">😈</span>
            <span v-if="col === -2">⛰️</span>
            <span v-if="villages.some(v => v.x === rowIndex && v.y === colIndex)">🏛️</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.map {
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-top: 68px;
  justify-content: center;
  align-items: center;

  .row {
    display: flex;

    &:last-child {
      .col {
        border-bottom: 1px solid #E5E5E5;
      }
    }

    .col {
      width: 68px;
      height: 68px;
      border-right: 1px solid #E5E5E5;
      border-top: 1px solid #E5E5E5;

      &:nth-child(10n+1) {
        border-left: 1px solid #E5E5E5;
      }

      .item {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
      }
    }
  }
}</style>
