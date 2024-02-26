<script setup>
import { ref } from 'vue'

const emit = defineEmits(['upgrade'])

defineProps({
  cityList: Array,
  buildingList: Array,
  blockHeight: Number
})

const upgradeFun = (city) => {
  emit('upgrade', city)
}
</script>

<template>
  <div class="title">City List</div>
  <div class="list">
    <div class="item" v-for="city in cityList" :key="city.id">
      <div class="name">{{ city.name }} ({{ city.level }})</div>
      <div class="btn" v-if="!buildingList.find(item => item.id === city.id)" @click="upgradeFun(city)">upgrade</div>
    </div>
  </div>
  <div class="title">Building List</div>
  <div class="building-list">
    <div class="building-item" v-for="building in buildingList" :key="building.id">
      <div class="item-name">{{ building.name }}</div>
      <div class="item-level">{{ building.targetLevel }}</div>
      <div class="item-blocks">{{ building.endBlock - blockHeight }} Blocks</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .item {
    width: 200px;
    height: 88px;
    margin-right: 16px;
    margin-bottom: 16px;
    border: 1px solid #E5E5E5;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    .name {
      font-size: 16px;
    }
    .btn {
      width: 120px;
      height: 30px;
      margin-top: 16px;
      background-color: #F5F7F8;
      border-radius: 5px;
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: #1890ff;
        color: #fff;
      }
    }
  }
}
.building-list {
  .building-item {
    border: 1px solid #E5E5E5;
    padding: 0 10px;
    height: 32px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    width: 400px;
    margin-bottom: 12px;
    .item-name {
      flex: 0 0 160px;
      width: 160px;
    }
    .item-level {
      flex: 1;
    }
    .item-blocks {
      flex: 0 0 80px;
      width: 80px;
    }
  }
}
.title {
  font-size: 20px;
  margin-bottom: 24px;
  margin-top: 24px;
  font-weight: 500;
}
</style>
