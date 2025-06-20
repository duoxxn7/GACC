<template>
  <view class="container">
    <!-- <button @click="refresh">shuaxin</button> -->
    <!-- 搜索栏 -->
    <view class="search-bar" @click="goToSearch">
      <uni-icons type="search" size="20" color="#999" />
      <text class="placeholder">搜索游戏商品...</text>
    </view>

    <!-- 横向轮播图：展示 商品名、游戏名、价格 -->
    <swiper class="horizontal-swiper" circular :autoplay="true" interval="3000">
      <swiper-item v-for="item in approvedItems" :key="item.ItemID" @click="goToDetail(item.ItemID)">
        <view class="swiper-item">
          <image :src="item.ItemImage" mode="aspectFill" class="swiper-image" />
          <view class="swiper-overlay">
            <text class="item-name">{{ item.ItemName }}</text>
            <text class="game-name">{{ item.GameName }}</text>
            <text class="price">¥{{ item.Price }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 纵向楼层图：两列布局，展示 名称 和 分类 -->
    <view class="floor-container">
      <view v-for="game in groupedByGame" :key="game.gameName" class="floor-item">
        <text class="floor-title">{{ game.gameName }}</text>
        <view class="game-items">
          <view v-for="item in game.items" :key="item.ItemID" class="item-card" @click="goToDetail(item.ItemID)">
            <image :src="item.ItemImage" mode="aspectFill" class="item-image" />
            <view class="item-info">
              <text class="item-name">{{ item.ItemName }}</text>

              <text class="type">{{ item.ItemType }}</text>
              <text class="price">¥{{ item.Price }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        items: [], // 从后端 GET /items 拿到的商品列表（含 SellerID，但无 SellerName）
        sellers: {} // 本地映射：SellerID → UserName
      };
    },
    computed: {
      // 只展示已审核通过 (IsApproved = true) 的商品
      approvedItems() {
        return this.items.filter(item => item.IsApproved === true);
      },
      // 按游戏名称分组，生成 { gameName, items: [...] } 数组
      groupedByGame() {
        const groups = {};
        this.approvedItems.forEach(item => {
          if (!groups[item.GameName]) {
            groups[item.GameName] = {
              gameName: item.GameName,
              items: []
            };
          }
          groups[item.GameName].items.push(item);
        });
        return Object.values(groups);
      }
    },
    methods: {
      goToSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        });
      },
      /* refresh() {
        uni.showToast({
          title: 'refresh',
          icon: 'none'
        });
      }, */
      goToDetail(itemID) {
        uni.navigateTo({
          url: `/subpkg/detail/detail?itemID=${encodeURIComponent(itemID)}`
        });
      },
      // 1) 拉取商品列表
      fetchItems() {
        uni.request({
          url: 'http://localhost:3000/items',
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200) {
              this.items = res.data;
              // 拿到 items 以后，再批量去拿每个 SellerID 对应的 UserName
              this.fetchAllSellerNames();
            } else {
              uni.showToast({
                title: '获取商品列表失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            console.error('fetchItems error:', err);
            uni.showToast({
              title: '请求商品列表出错',
              icon: 'none'
            });
          }
        });
      },
      // 2) 遍历 items，收集所有不同的 SellerID，然后一一去 GET /users/:id 拿 UserName
      async fetchAllSellerNames() {
        const sellerSet = new Set(this.items.map(item => item.SellerID));
        const sellerPromises = [];

        sellerSet.forEach(sellerID => {
          if (this.sellers[sellerID]) return; // 如果已经缓存过，不做重复请求

          console.log(`Fetching data for SellerID: ${sellerID}`); // 调试输出

          const sellerPromise = new Promise((resolve, reject) => {
            uni.request({
              url: `http://localhost:3000/users/${encodeURIComponent(sellerID)}`,
              method: 'GET',
              success: (res) => {
                console.log(`Response for SellerID ${sellerID}:`, res); // 调试输出
                if (res.statusCode === 200 && res.data.UserName) {
                  this.$set(this.sellers, sellerID, res.data.UserName || '未知商家');
                } else {
                  this.$set(this.sellers, sellerID, '未知商家');
                }
                resolve();
              },
              fail: (err) => {
                console.error(`Error fetching Seller ${sellerID}:`, err);
                this.$set(this.sellers, sellerID, '未知商家');
                resolve(); // Resolve even if there was an error
              }
            });
          });
          sellerPromises.push(sellerPromise);
        });

        // 等待所有请求完成
        await Promise.all(sellerPromises);
        this.$nextTick(() => {
          console.log('All seller data loaded:', this.sellers);
        });
      },

    },
    onLoad() {
      this.fetchItems();
    }
  };
</script>

<style lang="scss">
  .container {
    background-color: #f5f5f5;
    padding: 20rpx;
  }

  /* 搜索栏 */
  .search-bar {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 40rpx;
    padding: 20rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .placeholder {
      margin-left: 15rpx;
      color: #999;
      font-size: 28rpx;
    }
  }

  /* 横向轮播 */
  .horizontal-swiper {
    height: 350rpx;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 40rpx;

    .swiper-item {
      position: relative;
      width: 100%;
      height: 100%;

      .swiper-image {
        width: 100%;
        height: 100%;
      }

      .swiper-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20rpx;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        color: #fff;

        .item-name {
          font-size: 36rpx;
          font-weight: bold;
        }

        .game-name {
          font-size: 28rpx;
          margin: 5rpx 0;
        }

        .price {
          font-size: 32rpx;
          color: #ffd700;
        }
      }
    }
  }

  /* 纵向楼层图 */
  .floor-container {
    .floor-item {
      margin-bottom: 0rpx;

      .floor-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 30rpx;
      }

      /* 关键：父容器必须是 flex-row 并允许换行 */
      .game-items {
        display: flex;
        flex-direction: row;
        /* 横向铺排 */
        flex-wrap: wrap;
        /* 允许换行 */
        justify-content: space-between;
      }

      .item-card {
        width: 49%;
        margin-bottom: 20rpx;
        /* 下一行留点距离 */
        background-color: #fff;
        border-radius: 12rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
        overflow: hidden;

        .item-image {
          width: 100%;
          height: 200rpx;
        }

        .item-info {
          padding: 16rpx;

          .item-name {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
          }

          .seller {
            font-size: 24rpx;
            color: #304866;
            margin-bottom: 8rpx;
          }

          .type {
            font-size: 24rpx;
            color: #31b7ff;
            margin-bottom: 8rpx;
          }

          .price {
            font-size: 28rpx;
            color: #e64340;
            margin-top: 10rpx;
          }
        }
      }
    }
  }
</style>