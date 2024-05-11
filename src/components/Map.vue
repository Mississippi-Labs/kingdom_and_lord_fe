<script setup>
import { ref, onBeforeMount, watch, nextTick, inject } from 'vue'
import { useGlobalStore } from '../hooks/globalStore.js'
import { map } from '../libs/map.js'

const dojoContext = inject('DojoContext');

const { store } = useGlobalStore()

const dragging = {
  isDragging: false,
  startX: 0,
  startY: 0,
  originalX: 0,
  originalY: 0
}

const mapData = ref(map)
const mapRef = ref(null)
const viewport = ref(null)

const centerOnPower = (x, y) => {
  if (y !== undefined && x !== undefined) {
    const left = -(x * 32 - viewport.value.offsetWidth / 2 + 48);
    const top = -(y * 32 - viewport.value.offsetHeight / 2 + 16);

    // 计算边界，禁止拖动出视窗
    const minLeft = -(mapRef.value.offsetWidth - viewport.value.offsetWidth);
    const minTop = -(mapRef.value.offsetHeight - viewport.value.offsetHeight);

    mapRef.value.style.left = `${Math.min(0, Math.max(minLeft, left))}px`;
    mapRef.value.style.top = `${Math.min(0, Math.max(minTop, top))}px`;
  }
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

const getAllianceName = (address) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

onBeforeMount(() => {
})

watch(() => store.state.showMap, (newData) => {
  if (newData) {
    const playerVillage = store?.dojoComponents?.playerVillage?.[0] || {}
    nextTick(() => {
      centerOnPower(playerVillage.x || 0, playerVillage.y || 0)
    })
  }
})

watch(() => store.dojoComponents, (newData) => {
  const globeLocation = store?.dojoComponents?.globeLocation || []
  globeLocation.forEach(item => {
    mapData.value[item.x][item.y] = item.player
    // 上下左右的值也是item.player
    if (+item.x - 1 >= 0) {
      mapData.value[+item.x - 1][+item.y] = item.player
    }
    if (+item.x + 1 < 100) {
      mapData.value[+item.x + 1][+item.y] = item.player
    }
    if (+item.y - 1 >= 0) {
      mapData.value[+item.x][+item.y - 1] = item.player
    }
    if (+item.y + 1 < 100) {
      mapData.value[+item.x][+item.y + 1] = item.player
    }

  })
}, {immediate: true})

</script>

<template>
  <div class="map-wrap" ref="viewport" @mousedown="mousedown">
    <div class="map" ref="mapRef" @mousemove="mousemove" @mouseup="mouseup">
      <div class="row" v-for="(row, rowIndex) in mapData" :key="rowIndex">
        <div class="col" v-for="(col, colIndex) in row" :key="colIndex">
          <div class="item" style="font-size: 12px;">
            <div class="item-grass" v-if="col == 0">
              <img src="../assets/images/item_grass.png" alt="">
            </div>
            <!-- <n-popover v-if="col == -1" trigger="hover" :to="false" :show-arrow="false">
              <template #trigger>
                <div class="item-musketeer">
                  <img src="../assets/images/musketeer.png" alt="">
                </div>
              </template>
              <span>hidden soilder</span>
            </n-popover> -->
            <n-popover v-else-if="col == 2" trigger="hover" :to="false" :show-arrow="false">
              <template #trigger>
                <div class="item-cliff">
                  <img src="../assets/images/cliff.png" alt="">
                </div>
              </template>
              <span>oasis</span>
            </n-popover>
            <n-popover v-else trigger="hover" :to="false" :show-arrow="false">
              <template #trigger>
                <div  v-if="store.dojoComponents.globeLocation.some(v => v.x == rowIndex && v.y == colIndex)" class="item-keep">
                  <img src="../assets/images/cyanKeep.png" alt="">
                </div>
                <div v-else class="village">
                  <img src="../assets/images/grass.png" alt="">
                </div>
              </template>
              <div>{{col == dojoContext.account.address ? 'Home' : `alliance_${getAllianceName(col)}`}}</div>
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
  grid-template-columns: repeat(100, 32px);
  grid-template-rows: repeat(100, 32px);
  position: absolute;
  top: 0;
  left: 0;

  img {
    user-select: none;
    pointer-events: none;
  }

  .row {
    .col {
      width: 32px;
      height: 32px;
      border-right: 1px solid rgba(184,208,70,1);
      border-top: 1px solid rgba(184,208,70,1);

      .item {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        background: url(../assets/images/grass.png) no-repeat;
        // 处理雪碧图
        background-size: auto 32px;
        background-position: -64px 0;
        .item-musketeer {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          img {
            width: 152px;
            height: auto;
            position: absolute;
            top: 1px;
            left: 1px;
          }
        }
        .item-grass {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          img {
            height: 64px;
            width: auto;
            position: absolute;
            top: -32px;
            left: -32px;
          }
        }
        .item-cliff {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          img {
            width: 110px;
            height: auto;
            position: absolute;
            top: -30px;
            left: -80px;
          }
        }
        .item-keep {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          img {
            width: 98px;
            height: auto;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .village {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          img {
            width: auto;
            height: 32px;
            position: absolute;
            top: 0;
            left: -96px;
          }
        }
        // div {
        //   width: 100%;
        //   height: 100%;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   cursor: pointer;
        // }
      }
    }
  }
}
</style>
