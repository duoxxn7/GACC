<!-- search.vue -->

<template>
  <view class="search-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input v-model="searchQuery" placeholder="请输入商品名或游戏名" />
      <button @click="searchItems" size="mini">搜索</button>
    </view>

    <!-- 搜索结果展示 -->
    <view v-if="items.length > 0" class="search-results">
      <view v-for="item in items" :key="item.ItemID" class="item-card" @click="goToDetail(item.ItemID)">
        <image :src="item.ItemImage" mode="aspectFill" class="item-image" />
        <view class="item-info">
          <text class="item-name">{{ item.ItemName }}</text>
          <text class="game-name">{{ item.GameName }}</text>
          <text class="price">¥{{ item.Price }}</text>
        </view>
      </view>
    </view>
    <view v-else class="no-results" v-if="searchQuery && items.length === 0">
      <text>没有找到相关商品</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',  // 用户输入的搜索关键词
      items: []  // 搜索结果
    };
  },
  methods: {
    
    goToDetail(itemID) {
      uni.navigateTo({
        url: `/subpkg/detail/detail?itemID=${encodeURIComponent(itemID)}`
      });
    },
    
    // 执行搜索操作
    searchItems() {
      if (!this.searchQuery) {
        uni.showToast({
          title: '请输入搜索关键词',
          icon: 'none'
        });
        return;
      }

      uni.request({
        url: `http://localhost:3000/search?query=${encodeURIComponent(this.searchQuery)}`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200) {
            this.items = res.data;
          } else {
            uni.showToast({
              title: '没有找到相关商品',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('搜索请求失败:', err);
          uni.showToast({
            title: '请求失败，请稍后重试',
            icon: 'none'
          });
        }
      });
    },
    
    
  }
};
</script>

<style lang="scss">
.search-container {
  padding: 20rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.search-bar input {
  flex: 1;
  padding: 10rpx;
  border-radius: 20rpx;
  border: 1px solid #ccc;
  margin-right: 10rpx;
}

.search-bar button {
  padding: 10rpx 20rpx;
  background-color: #409eff;
  color: #fff;
  border-radius: 20rpx;
}

.search-results {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.item-card {
  width: 48%;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100%;
  height: 200rpx;
  border-radius: 12rpx 12rpx 0 0;
}

.item-info {
  padding: 10rpx;
}

.item-name {
  font-size: 18rpx;
  font-weight: bold;
}

.game-name {
  font-size: 16rpx;
  color: #777;
}

.price {
  font-size: 18rpx;
  color: #e64340;
}

.no-results {
  text-align: center;
  font-size: 18rpx;
  color: #999;
}
</style>
