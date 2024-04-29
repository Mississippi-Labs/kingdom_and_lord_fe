<script setup>
import { useGlobalStore } from '../hooks/globalStore.js'
import { copy } from '../utils/index.js'
import { useMessage } from 'naive-ui';
const props = defineProps({
  resource: {
    type: Object,
    default: {
      "wood": 0,
      "steel": 0,
      "brick": 0,
      "food": 0
    }
  },
  storage: {
    type: Object,
    default: {
      barn: 0,
      warehouse: 0
    }
  },
  address: {
    type: String,
    default: ''
  }
})

const { store, setMenuIndex, setShowMap } = useGlobalStore()
const message = useMessage()

const showMap = () => {
  setShowMap(true)
}

const getProgress = (count, storage) => {
  const progress = (Number(count) / Number(storage)) * 100
  if (progress >= 100) return '100%'
  else return progress + '%'
}

const formatAddress = () => {
  if (!props.address) return ''
  return props.address.slice(0, 4) + '...' + props.address.slice(-4)
}

const copyFun = async () => {
  await copy(props.address)
  message.success('Copied')
}

</script>
<template>
  <div class="nav">
    <div class="main flex-end-sb">
      <div class="l flex-center">
      <img src="../assets/images/logo.png" alt="" class="logo">
      <div class="menu flex-center-center">DOCS</div>
      <div class="menu flex-center-center">TW</div>
      <div class="menu flex-center-center">More <br /> Icon</div>
    </div>
    <div class="m flex-center-center">
      <div class="m-content">
        <div class="section flex-center-center">
          <div class="section-item flex-center-center" @click="setMenuIndex(0)">
            <img src="../assets/images/city_1.png" alt="">
          </div>
          <div class="section-item flex-center-center">
            <img src="../assets/images/city_2.png" alt="" @click="setMenuIndex(1)">
          </div>
          <div class="section-item flex-center-center" @click="showMap">
            <img src="../assets/images/city_3.png" alt="">
          </div>
          <div class="section-item flex-center-center">
            <img src="../assets/images/city_4.png" alt="">
          </div>
          <div class="section-item flex-center-center">
            <img src="../assets/images/city_5.png" alt="">
          </div>
        </div>
        <div class="resource flex-center-center">
          <div class="resource-item resource-item-1 flex-center-sb">
            <div class="flex-center">
              <div class="icon flex-end-center">
                <img src="../assets/images/cityB.png" alt="">
              </div>
              <div class="total-amount">{{ Number(storage.warehouse) }}</div>
            </div>

            <div class="item-detail flex-center-sb">
              <div class="item flex-center">
                <div class="item-img flex-center-center">
                  <img src="../assets/images/resource_icon_1.png" alt="">
                </div>
                <div class="item-info">
                  <p>{{ (+resource.wood).toLocaleString() }}</p>
                  <div class="progress-wrap">
                    <div class="progress" :style="{ width: getProgress(resource.wood, storage.warehouse), background:  getProgress(resource.wood, storage.warehouse) == '100%' ? 'red' : '#8AA147'}"></div>
                  </div>
                </div>
              </div>
              <div class="item flex-center">
                <div class="item-img flex-center-center">
                  <img src="../assets/images/resource_icon_3.png" alt="">
                </div>
                <div class="item-info">
                  <p>{{ (+resource.steel).toLocaleString() }}</p>
                  <div class="progress-wrap">
                    <div class="progress" :style="{ width: getProgress(resource.steel, storage.warehouse), background:  getProgress(resource.wood, storage.warehouse) == '100%' ? 'red' : '#8AA147' }"></div>
                  </div>
                </div>
              </div>
              <div class="item flex-center">
                <div class="item-img flex-center-center">
                  <img src="../assets/images/resource_icon_2.png" alt="">
                </div>
                <div class="item-info">
                  <p>{{ (+resource.brick).toLocaleString() }}</p>
                  <div class="progress-wrap">
                    <div class="progress" :style="{ width: getProgress(resource.brick, storage.warehouse), background:  getProgress(resource.wood, storage.warehouse) == '100%' ? 'red' : '#8AA147' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="resource-item resource-item-2 flex-center-sb">
            <div class="flex-center">
              <div class="icon flex-end-center">
                <img src="../assets/images/cityD.png" alt="">
              </div>
              <div class="total-amount">{{ Number(storage.barn) }}</div>
            </div>
            <div class="item-detail flex-center-sb">
              <div class="item flex-center">
                <div class="item-img flex-center-center">
                  <img src="../assets/images/resource_icon_4.png" alt="">
                </div>
                <div class="item-info">
                  <p>{{ (+resource.food).toLocaleString() }}</p>
                  <div class="progress-wrap">
                    <div class="progress" :style="{ width: getProgress(resource.food, storage.barn), background:  getProgress(resource.wood, storage.warehouse) == '100%' ? 'red' : '#8AA147' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="r flex-center">
      <div class="network flex-center-sb">
        <img src="../assets/images/icon_k.png" alt="" class="icon">
        <p>Katana Testnet</p>
      </div>
      <div class="wallet flex-center-sb">
        <img src="../assets/images/icon_l.png" alt="" class="icon">
        <p>20 LORDS</p>
        <div class="address flex-center-center" @click="copyFun">{{ formatAddress() }}</div>
      </div>
    </div>
    </div>
    
  </div>
</template>
<style lang="scss" scoped>
.nav {
  width: 100vw;
  height: 74px;
  background: url('../assets/images/top_bg.png') repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  color: #fff;
  font-size: 12px;
  position: fixed;
  top: 0;
  z-index: 999;
  left: 0;

  .main {
    max-width: 1440px;
    padding: 0 10px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 12px;
    right: 0;
    margin: auto;
  }

  .m {
    flex: 1;
    font-size: 0;

    .m-content {
      width: 690px;
      height: 125px;
      background: url('../assets/images/resource_bg.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      top: 66px;
      padding: 8px 13px 13px;
      box-sizing: border-box;

      .section {
        width: 100%;

        .section-item {
          width: 64px;
          height: 64px;
          background: url('../assets/images/city_bg.png') no-repeat;
          background-size: 100% 100%;
          cursor: pointer;

          img {
            width: 100%;
            height: auto;
          }

          &~.section-item {
            margin-left: 64px;
          }
        }
      }

      .resource {
        margin-top: 3px;

        .icon {
          position: relative;
          width: 24px;
          height: 24px;
          background-color: #000;
          border-radius: 50%;

          img {
            width: 32px;
            height: auto;
            position: relative;
            z-index: 2;
          }
        }

        .resource-item {
          background: #463535;
          border-radius: 9px;
          padding: 0 3px 0 6px;
          box-sizing: border-box;
          height: 34px;

          .total-amount {
            color: #ffb700;
            font-size: 12px;
            margin-left: 8px;
          }

          .item-detail {
            height: 28px;
            background: #fff;
            border-radius: 8px;
            padding: 0 6px;

            .item {
              .item-img {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba($color: #000000, $alpha: .2);
                position: relative;
                z-index: 2;
              }

              img {
                width: 22px;
                height: auto;
              }

              .item-info {
                margin-left: 6px;
                line-height: 1;
                font-size: 12px;
                color: #000;

                p {
                  margin-top: -2px;
                  margin-bottom: 2px;
                }

                .progress-wrap {
                  width: 68px;
                  height: 8px;
                  background: #231a1a;
                  border-radius: 2px;
                  position: relative;

                  .progress {
                    height: 100%;
                    background: #8AA147;
                    border-radius: 2px;
                    position: absolute;
                    top: 0;
                    left: 0;
                  }
                }
              }
            }
          }
        }

        .resource-item-1 {
          width: 414px;
          flex: 0 0 414px;

          .item-detail {
            width: 320px;
          }
        }

        .resource-item-2 {
          width: 230px;
          flex: 0 0 230px;
          margin-left: 8px;

          .item-detail {
            width: 137px;
          }
        }
      }
    }
  }

  .l {
    flex: 0 0 350px;
    width: 350px;
    .logo {
      height: 36px;
      width: auto;
      cursor: pointer;
    }

    .menu {
      margin-left: 10px;
      width: 36px;
      height: 36px;
      background: url('../assets/images/nav_bg.png') no-repeat;
      background-size: 100% 100%;
      font-family: 'Chalkboard-Bold';
      cursor: pointer;
    }
  }

  .r {
    flex: 0 0 350px;
    width: 350px;
    .icon {
      width: 25px;
      height: 25px;
    }

    .network {
      background: url('../assets/images/nav_bg.png') no-repeat;
      background-size: 100% 100%;
      height: 36px;
      width: 130px;
      padding: 0 6px;
      box-sizing: border-box;
    }

    .wallet {
      margin-left: 10px;
      padding: 0 8px 0 6px;
      box-sizing: border-box;
      background: url('../assets/images/nav_bg.png') no-repeat;
      background-size: 100% 100%;
      width: 204px;
      height: 36px;

      .address {
        width: 96px;
        height: 24px;
        background-color: #231a1a;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
}
</style>