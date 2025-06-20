<template>
  <view class="cart-container">
    <!-- 购物车中的商品列表 -->
    <view v-if="cartItems.length > 0">
      <view v-for="item in cartItems" :key="item.CartID" class="cart-item">
        <view class="item-selector">
          <checkbox-group @change="toggleSelect(item.CartID)">
            <checkbox :checked="item.selected" color="#67C23A" />
          </checkbox-group>
        </view>
        <image :src="item.ItemImage" class="item-image" />
        <view class="item-details">
          <text class="item-name">{{ item.ItemName }}</text>
          <text class="item-price">¥{{ item.Price }}</text>
          <view class="quantity-control">
            <button @click="decreaseQuantity(item)" size="mini" :disabled="item.Quantity <= 1">-</button>
            <text class="quantity">{{ item.Quantity }}</text>
            <button @click="increaseQuantity(item)" size="mini">+</button>
          </view>
        </view>
        <button class="delete-btn" @click="removeFromCart(item)" size="mini">删除</button>
      </view>
    </view>

    <!-- 如果购物车为空 -->
    <view v-else class="empty-cart">
      <image src="/static/empty-cart.png" class="empty-image" />
      <text class="empty-text">购物车为空</text>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <!-- 全选操作区 -->
      <view class="select-section">
        <checkbox-group @change="toggleSelectAll">
          <checkbox :checked="allSelected" color="#67C23A" />
          <text class="select-all-text">全选</text>
        </checkbox-group>
      </view>

      <!-- 总金额显示 -->
      <view class="amount-section">
        <text class="total-label">合计:</text>
        <text class="total-amount">¥{{ totalAmount }}</text>
      </view>

      <!-- 操作按钮 -->
      <view class="button-section">
        <button class="btn-refresh" @click="refreshCart">刷新</button>
        <button class="btn-checkout" @click="checkout" :disabled="selectedCount === 0">
          结算({{ selectedCount }})
        </button>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        cartItems: [], // 购物车商品列表
        allSelected: false // 全选状态
      };
    },
    computed: {
      // 计算选中的商品总金额
      totalAmount() {
        return this.cartItems.reduce((total, item) => {
          if (item.selected) {
            total += item.Price * item.Quantity;
          }
          return total;
        }, 0).toFixed(2);
      },
      // 计算选中商品数量
      selectedCount() {
        return this.cartItems.filter(item => item.selected).length;
      },
      // 是否所有商品都已选中
      isAllSelected() {
        if (this.cartItems.length === 0) return false;
        return this.cartItems.every(item => item.selected);
      },
    },
    methods: {
      // 获取购物车数据
      fetchCart() {
        uni.showLoading({
          title: '加载中...'
        });
        uni.request({
          url: `http://localhost:3000/cart/${this.$globalData.userID}`,
          success: (res) => {
            uni.hideLoading();
            if (res.statusCode === 200) {
              // 初始化选中状态
              this.cartItems = res.data.map(item => ({
                ...item,
                selected: false
              }));
              this.allSelected = false; // 初始化全选状态
            } else {
              uni.showToast({
                title: '获取购物车失败',
                icon: 'none'
              });
            }
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({
              title: '网络请求失败',
              icon: 'none'
            });
          }
        });
      },
      // 刷新购物车
      refreshCart() {
        this.fetchCart();
      },
      // 从购物车移除商品
      removeFromCart(item) {
        uni.showLoading({
          title: '删除中...'
        });
        uni.request({
          url: `http://localhost:3000/cart/${this.$globalData.userID}/${item.ItemID}`,
          method: 'DELETE',
          success: (res) => {
            uni.hideLoading();
            if (res.statusCode === 200) {
              uni.showToast({
                title: '删除成功'
              });
              this.fetchCart();
            } else {
              uni.showToast({
                title: res.data.error,
                icon: 'none'
              });
            }
          },
          fail: () => {
            uni.hideLoading();
            uni.showToast({
              title: '请求失败',
              icon: 'none'
            });
          },
        });
      },
      // 增加商品数量
      increaseQuantity(item) {
        this.updateQuantity(item, item.Quantity + 1);
      },
      // 减少商品数量
      decreaseQuantity(item) {
        if (item.Quantity > 1) {
          this.updateQuantity(item, item.Quantity - 1);
        }
      },
      // 更新商品数量
      updateQuantity(item, newQuantity) {
        uni.request({
          url: `http://localhost:3000/cart/${this.$globalData.userID}/${item.ItemID}`,
          method: 'PUT',
          data: {
            Quantity: newQuantity
          },
          success: (res) => {
            if (res.statusCode === 200) {
              const response = res.data;

              if (response.success) {
                // 更新成功
                item.Quantity = newQuantity;
                uni.showToast({
                  title: '数量更新成功',
                  icon: 'success'
                });
              } else {
                // 处理业务逻辑错误
                if (response.code === 'INSUFFICIENT_STOCK') {
                  uni.showToast({
                    title: `库存不足，仅剩${response.data.available}件`,
                    icon: 'none'
                  });
                } else {
                  uni.showToast({
                    title: response.message || '更新失败',
                    icon: 'none'
                  });
                }
                // 恢复原来的数量
                this.$forceUpdate();
              }
            }
          },
          fail: (err) => {
            uni.showToast({
              title: '网络错误，请重试',
              icon: 'none'
            });
            console.error('请求失败:', err);
          }
        });
      },
      // 新增方法：切换全选状态
      toggleSelectAll() {
        this.allSelected = !this.allSelected;
        this.cartItems.forEach(item => {
          item.selected = this.allSelected;
        });
        this.$forceUpdate();
      },
      // 切换选中状态
      toggleSelect(cartID) {
        const item = this.cartItems.find(item => item.CartID === cartID);
        if (item) {
          item.selected = !item.selected;
          // 检查是否所有商品都被选中
          this.allSelected = this.isAllSelected;
        }
      },
      // 结账按钮点击事件
      checkout() {
        if (this.selectedCount === 0) return;

        const selectedItems = this.cartItems.filter(item => item.selected);
        uni.navigateTo({
          url: `/subpkg/checkout/checkout?items=${encodeURIComponent(JSON.stringify(selectedItems))}`
        });
      }
    },
    onLoad() {
      this.fetchCart();
    },
  };
</script>

<style scoped>
  .cart-container {
    padding: 20rpx;
    padding-bottom: 120rpx;
    /* 留出空间给底部按钮 */
    min-height: 100vh;
    background-color: #f7f7f7;
  }

  /* 购物车商品项 */
  .cart-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  }

  .item-selector {
    margin-right: 20rpx;
  }

  .item-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }

  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .item-name {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 10rpx;
    font-weight: bold;
  }

  .item-price {
    font-size: 26rpx;
    color: #e64340;
    margin-bottom: 20rpx;
  }

  .quantity-control {
    display: flex;
    align-items: center;
  }

  .quantity-control button {
    width: 50rpx;
    height: 50rpx;
    line-height: 50rpx;
    padding: 0;
    font-size: 28rpx;
  }

  .quantity {
    margin: 0 20rpx;
    font-size: 28rpx;
  }

  .delete-btn {
    margin-left: 20rpx;
    color: #999;
    border: 1rpx solid #eee;
    background-color: transparent;
  }

  /* 空购物车样式 */
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
  }

  .empty-image {
    width: 50rpx;
    height: 50rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }

  /* 删除原有的 .select-all-bar 样式 */

  /* 修改后的底部操作栏样式 */
  .action-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #fff;
    box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.08);
    z-index: 10;
  }

  /* 新增全选区域样式 */
  .select-section {
    display: flex;
    align-items: center;
    margin-right: 20rpx;
  }

  .select-all-text {
    margin-left: 10rpx;
    font-size: 28rpx;
    color: #333;
  }

  /* 调整金额区域 */
  .amount-section {
    flex: 1;
    display: flex;
    align-items: center;
    /* 改为居中对齐 */
  }

  .total-label {
    font-size: 28rpx;
    color: #666;
    margin-right: 10rpx;
  }

  .total-amount {
    font-size: 32rpx;
    color: #e64340;
    font-weight: bold;
  }

  /* 调整按钮区域 */
  .button-section {
    display: flex;
    margin-left: auto;
    /* 让按钮组靠右 */
  }

  .btn-refresh {
    width: 120rpx;
    height: 80rpx;
    line-height: 80rpx;
    margin-right: 20rpx;
    background-color: #f1f1f1;
    color: #666;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: none;
  }

  .btn-checkout {
    width: 200rpx;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #67c23a;
    color: white;
    border-radius: 40rpx;
    font-size: 30rpx;
  }

  .btn-checkout[disabled] {
    background-color: #c8c9cc;
    color: #fff;
  }
</style>