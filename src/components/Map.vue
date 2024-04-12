<script setup>
import { ref, onBeforeMount } from 'vue'
import { map } from '../libs/data'

const colors = [
  '255, 0, 0',
  '0, 255, 0',
  '0, 0, 255',
  '255, 255, 0',
  '0, 255, 255'
]

const villages = ref([{"x":7,"y":9},{"x":1,"y":1},{"x":0,"y":3},{"x":5,"y":0},{"x":8,"y":3},{"x":2,"y":9},{"x":6,"y":2},{"x":0,"y":9},{"x":8,"y":8}])
const mapData = ref(map)
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
            <n-popover v-if="col == -1" trigger="hover" :show-arrow="false">
              <template #trigger>
                <div style="background: rgba(255, 0, 0, .2);">🥷🏻</div>
              </template>
              <span>hidden soilder</span>
            </n-popover>
            <n-popover v-if="col == -2" trigger="hover" :show-arrow="false">
              <template #trigger>
                <div>⛰️</div>
              </template>
              <span>oasis</span>
            </n-popover>
            <n-popover v-if="col > 0" trigger="hover" :show-arrow="false">
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
}</style>
