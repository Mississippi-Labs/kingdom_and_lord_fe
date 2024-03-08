<script setup>
import { ref } from 'vue'

const emit = defineEmits(['upgrade'])

defineProps({
  cityList: Array,
  buildingList: Array,
  blockHeight: Number
})

const getCityName = (id) => {
  if (id >= 0 && id <= 3) {
    return "Wood Factory"
  } else if (id >= 4 && id <= 7) {
    return "Steel Factory"
  } else if (id >= 8 && id <= 11) {
    return "Brick Factory"
  } else if (id >= 12 && id <= 17) {
    return "Farm"
  } else if (id == 18) {
    return "City Hall"
  } else if (id == 19) {
    return "Warehouse"
  } else if (id == 20) {
    return "Barn"
  }
}

const upgradeFun = (city) => {
  emit('upgrade', city)
}
</script>

<template>
  <div class="title">City List</div>
  <div class="list">
    <n-card v-for="city in cityList" hoverable :key="city.id"
      :title="`${getCityName(city?.building_id)} (${city?.building?.level?.level || city?.level?.level || 0})`"
      style="width: 220px;height: 94px;margin: 0 12px 12px 0;font-size: 0;">
      <n-button v-if="!buildingList.find(item => item.building_id === city.building_id)" :disabled="buildingList.length >= 2" strong
        secondary @click="upgradeFun(city)">upgrade</n-button>
    </n-card>
  </div>
  <div class="title">Building List</div>
  <div class="building-list">
    <div class="building-item" v-for="building in buildingList" :key="building.id">
      <div class="item-name">{{ getCityName(building.building_id) }}</div>
      <div class="item-level">{{ building.target_level.level }}</div>
      <div class="item-blocks">{{ building.end_time - blockHeight >= 0 ? building.end_time - blockHeight : 0 }} Blocks</div>
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
    font-size: 0;

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
      flex: 0 0 120px;
      width: 120px;
      text-align: right;
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
