<script setup>
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
  }
})

const getProgress = (count, storage) => {
  let progress = ((+count) / (+storage)) * 100
  if (progress >= 100) return '100%'
  else return progress + '%'
}

</script>
<template>
  <div class="nav flex-end-sb">
    <div class="l flex-center">
      <img src="../assets/images/logo.png" alt="" class="logo">
      <div class="menu flex-center-center">DOCS</div>
      <div class="menu flex-center-center">TW</div>
      <div class="menu flex-center-center">More <br /> Icon</div>
    </div>
    <div class="m flex-center-center">
      <div class="m-content">
        <div class="section flex-center-center">
          <div class="section-item flex-center-center">
            <img src="../assets/images/city_1.png" alt="">
          </div>
          <div class="section-item flex-center-center">
            <img src="../assets/images/city_2.png" alt="">
          </div>
          <div class="section-item flex-center-center">
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
            <div class="icon flex-center-center">
              <img src="../assets/images/resource_1.png" alt="">
            </div>
            <div class="total-amount">{{ (+storage.warehouse).toLocaleString() }}</div>
            <div class="item-detail flex-center-sb">
              <div class="item flex-center">
                <img src="../assets/images/resource_1_item.png" alt="">
                <div class="item-info">
                  <p>{{ (+resource.wood).toLocaleString() }}</p>
                  <div class="progress-wrap">
                    <div class="progress" :style="{width: getProgress(resource.wood, storage.warehouse)}"></div>
                  </div>
                </div>
              </div>
              <div class="item flex-center">
                <img src="../assets/images/resource_1_item.png" alt="">
                <div class="item-info">
                  <p>{{ (+resource.steel).toLocaleString() }}</p>
                  <div class="progress-wrap">
                    <div class="progress" :style="{width: getProgress(resource.steel, storage.warehouse)}"></div>
                  </div>
                </div>
              </div>
              <div class="item flex-center">
                <img src="../assets/images/resource_1_item.png" alt="">
                <div class="item-info">
                  <p>{{ (+resource.brick).toLocaleString() }}</p>
                  <div class="progress-wrap">
                    <div class="progress" :style="{width: getProgress(resource.brick, storage.warehouse)}"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="resource-item resource-item-2 flex-center-sb">
            <div class="icon flex-center-center">
              <img src="../assets/images/resource_2.png" alt="">
            </div>
            <div class="total-amount">{{ (+storage.barn).toLocaleString() }}</div>
            <div class="item-detail flex-center-sb">
              <div class="item flex-center">
                <img src="../assets/images/resource_2_item.png" alt="">
                <div class="item-info">
                  <p>{{ (+resource.food).toLocaleString() }}</p>
                  <div class="progress-wrap">
                    <div class="progress" :style="{width: getProgress(resource.food, storage.barn)}"></div>
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
        <div class="address flex-center-center">0x33 .... f940</div>
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
  padding: 0 10px;
  box-sizing: border-box;
  padding-bottom: 12px;
  color: #fff;
  font-size: 12px;

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

          img {
            width: 24px;
            height: auto;
            position: relative;
            z-index: 2;
          }

          .ellipse {
            width: 24px;
            height: 24px;
            background-color: #000;
            border-radius: 50%;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
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
          }

          .item-detail {
            height: 28px;
            background: #fff;
            border-radius: 8px;
            padding: 0 6px;

            .item {
              img {
                width: 20px;
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
      }
    }
  }
}
</style>