<script setup>
import { ref, onBeforeMount } from 'vue'

const colors = []
const dragging = {
  isDragging: false,
  startX: 0,
  startY: 0,
  originalX: 0,
  originalY: 0
}

const villages = ref([])
const mapData = ref([])
const mapRef = ref(null)
const viewport = ref(null)
const getBg = (col) => {
  if (col > 0) {
    return { background: `rgba(${colors[col - 1]}, 0.2)` }
  } else {
    return ''
  }
}

const createMap = (size, numberOfVillages, numberOfMountains) => {
  // 创建一个size * size的数组，初始化为0
  let map = new Array(size).fill(0).map(() => new Array(size).fill(0));
  let villageId = 1; // 村庄的初始ID

  // 随机放置村庄
  for (let i = 0; i < numberOfVillages; i++) {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      villages.value.push({ x: row, y: col });
      colors.push([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]);
      // 确保选定的位置为空
      if (map[row][col] === 0) {
        map[row][col] = villageId;
        // 设置村庄的势力范围
        if (row > 0 && map[row-1][col] === 0) map[row-1][col] = villageId; // 上
        if (row < size - 1 && map[row+1][col] === 0) map[row+1][col] = villageId; // 下
        if (col > 0 && map[row][col-1] === 0) map[row][col-1] = villageId; // 左
        if (col < size - 1 && map[row][col+1] === 0) map[row][col+1] = villageId; // 右
        villageId++;
        placed = true;
      }
    }
  }

  // 随机添加山脉
  for (let j = 0; j < numberOfMountains; j++) {
    let placed = false;
    while (!placed) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);

      // 确保山脉不覆盖村庄或其势力范围
      if (map[row][col] === 0) {
        map[row][col] = -2;
        placed = true;
      }
    }
  }

  // 随机分布忍者
  for (let k = 1; k <= villageId - 1; k++) { // 对每个村庄
    if (Math.random() > 0.5) { // 有一半的概率放置忍者
      let placed = false;
      while (!placed) {
        let possiblePositions = [];
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            // 忍者必须放在村庄的周围空闲格子上
            if (map[row][col] === k && ((map[row-1]?.[col] === 0) || (map[row+1]?.[col] === 0) ||
                (map[row]?.[col-1] === 0) || (map[row]?.[col+1] === 0))) {
              // 收集所有可能的位置
              if (row > 0 && map[row-1][col] === 0) possiblePositions.push([row-1, col]);
              if (row < size - 1 && map[row+1][col] === 0) possiblePositions.push([row+1, col]);
              if (col > 0 && map[row][col-1] === 0) possiblePositions.push([row, col-1]);
              if (col < size - 1 && map[row][col+1] === 0) possiblePositions.push([row, col+1]);
            }
          }
        }
        if (possiblePositions.length > 0) {
          let [ninjaRow, ninjaCol] = possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
          map[ninjaRow][ninjaCol] = -1;
          placed = true;
        } else {
          break; // 如果没有可用的位置，则不放置忍者
        }
      }
    }
  }

  return map;
}


const mousedown = (e) => {
  dragging.startX = e.clientX;
  dragging.startY = e.clientY;
  dragging.originalX = mapRef.value.offsetLeft;
  dragging.originalY = mapRef.value.offsetTop;
  dragging.isDragging = true;
  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
}

const mousemove = (e) => {
  const { startX, startY, originalX, originalY } = dragging;
  if (dragging.isDragging) {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const newX = originalX + deltaX;
    const newY = originalY + deltaY;

    // 计算边界，禁止拖动出视窗
    const minLeft = -(mapRef.value.offsetWidth - viewport.value.offsetWidth);
    const minTop = -(mapRef.value.offsetHeight - viewport.value.offsetHeight);

    mapRef.value.style.left = `${Math.min(0, Math.max(minLeft, newX))}px`;
    mapRef.value.style.top = `${Math.min(0, Math.max(minTop, newY))}px`;
  }
}

const mouseup = () => {
  document.removeEventListener('mousemove', mousemove);
  document.removeEventListener('mouseup', mouseup);
  dragging.isDragging = false;
}

onBeforeMount(() => {
  const mapLocal = localStorage.getItem('map');
  const villagesLocal = localStorage.getItem('villages');
  const colorsLocal = localStorage.getItem('colors');
  if (colorsLocal) {
    colors.push(...JSON.parse(colorsLocal));
  }
  if (villagesLocal) {
    villages.value = JSON.parse(villagesLocal);
  }
  if (mapLocal) {
    mapData.value = JSON.parse(mapLocal);
  } else {
    mapData.value = createMap(100, 400, 500);
    localStorage.setItem('map', JSON.stringify(mapData.value));
    localStorage.setItem('villages', JSON.stringify(villages.value));
    localStorage.setItem('colors', JSON.stringify(colors));
  }
})
</script>

<template>
  <div class="map-wrap" ref="viewport" @mousedown="mousedown">
    <div class="map" ref="mapRef" @mousemove="mousemove" @mouseup="mouseup">
      <div class="row" v-for="(row, rowIndex) in mapData" :key="rowIndex">
        <div class="col" v-for="(col, colIndex) in row" :key="colIndex">
          <div class="item" :style="getBg(col)">
            <n-popover v-if="col == -1" trigger="hover" :to="false" :show-arrow="false">
              <template #trigger>
                <div style="background: rgba(255, 0, 0, .2);">🥷🏻</div>
              </template>
              <span>hidden soilder</span>
            </n-popover>
            <n-popover v-if="col == -2" trigger="hover" :to="false" :show-arrow="false">
              <template #trigger>
                <div>⛰️</div>
              </template>
              <span>oasis</span>
            </n-popover>
            <n-popover v-if="col > 0" trigger="hover" :to="false" :show-arrow="false">
              <template #trigger>
                <div v-if="villages.some(v => v.x == rowIndex && v.y == colIndex)">🏛️</div>
                <div v-else></div>
              </template>
              <div>alliance_{{ col }}</div>
            </n-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.map-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background: green;
  font-size: 0;
  position: relative;
  user-select: none;
  cursor: pointer;
}

.map {
  display: grid;
  grid-template-columns: repeat(100, 64px);
  grid-template-rows: repeat(100, 64px);
  position: absolute;
  top: 0;
  left: 0;

  .row {
    .col {
      width: 64px;
      height: 64px;
      border-right: 1px solid #E5E5E5;
      border-top: 1px solid #E5E5E5;

      .item {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;

        div {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
