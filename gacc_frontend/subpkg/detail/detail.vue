<template>
  <view class="detail-container">
    <!-- 顶部图片大图 -->
    <swiper class="detail-swiper" circular :autoplay="true" interval="4000">
      <swiper-item v-if="itemDetail.ItemImage" :key="itemDetail.ItemID">
        <image :src="itemDetail.ItemImage" mode="aspectFit" class="detail-image" />
      </swiper-item>
    </swiper>

    <!-- 商品标题、基本信息 -->
    <view class="info-section">
      <text class="item-name">{{ itemDetail.ItemName }}</text>
      <view class="price-row">
        <text class="price">¥{{ itemDetail.Price }}</text>
        <text class="stock">库存：{{ itemDetail.Stock }}</text>
      </view>
      <view class="meta-row">
        <text class="meta">游戏：{{ itemDetail.GameName }}</text>
        <text class="meta">分类：{{ itemDetail.ItemType }}</text>
      </view>
      <view class="seller-row">
        <text class="meta">商家：{{ itemDetail.SellerName }}</text>
      </view>
    </view>

    <!-- 分割线 -->
    <view class="divider" />

    <!-- 底部操作栏：加入购物车 / 立即购买 -->
    <view class="action-bar">
      <button class="btn-cart" @click="showQuantityModal">加入购物车</button>
      <!-- <button class="btn-buy" @click="buyNow">立即购买</button> -->
    </view>

    <!-- 弹窗结构 -->
    <view class="quantity-modal" v-if="isModalVisible">
      <view class="modal-content">
        <view class="modal-header">选择数量</view>
        <view class="quantity-selector">
          <button @click="decrementQuantity">-</button>
          <text>{{ selectedQuantity }}</text>
          <button @click="incrementQuantity">+</button>
        </view>
        <view class="modal-actions">
          <button @click="closeModal">取消</button>
          <button @click="addToCartWithQuantity">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        quantity: 1, // 默认数量
        selectedQuantity: 1, // 用户选择的数量
        isModalVisible: false, // 是否显示数量选择弹窗
        itemDetail: {
          ItemID: '',
          ItemName: '',
          GameName: '',
          ItemType: '',
          Price: 0,
          Stock: 0,
          SellerID: '',
          SellerName: '',
          IsApproved: false,
          ItemImage: '', // 如果有多张图，可改为 ItemImages: []
        },
      };
    },
    methods: {
      // 显示选择数量的弹窗
      showQuantityModal() {
        this.selectedQuantity = 1; // 重置为最小数量
        this.isModalVisible = true; // 显示弹窗
      },
      // 关闭数量选择弹窗
      closeModal() {
        this.isModalVisible = false; // 关闭弹窗
      },
      // 增加选择数量
      incrementQuantity() {
        if (this.selectedQuantity < this.itemDetail.Stock) {
          this.selectedQuantity++;
        }
      },
      // 减少选择数量
      decrementQuantity() {
        if (this.selectedQuantity > 1) {
          this.selectedQuantity--;
        }
      },
      // 点击“加入购物车”时验证库存并加入购物车
      addToCartWithQuantity() {
        if (this.selectedQuantity <= this.itemDetail.Stock) {
          // 调用后端接口添加到购物车
          uni.request({
            url: 'http://localhost:3000/cart/add',
            method: 'POST',
            data: {
              //UserID: uni.getStorageSync('userID'),
              UserID: this.$globalData.userID,
              ItemID: this.itemDetail.ItemID,
              Quantity: this.selectedQuantity,
              ItemImage: this.itemDetail.ItemImage,
            },
            success: (res) => {
              if (res.statusCode === 200) {
                uni.showToast({
                  title: '已加入购物车',
                  icon: 'success',
                });
                this.closeModal(); // 关闭弹窗
              } else {
                uni.showToast({
                  title: '库存不足',
                  icon: 'none',
                });
              }
            },
            fail: (err) => {
              console.error('请求失败', err);
              uni.showToast({
                title: '添加到购物车失败',
                icon: 'none',
              });
            },
          });
        } else {
          uni.showToast({
            title: '库存不足',
            icon: 'none',
          });
        }
      },
      // 点击“立即购买”示例逻辑
      buyNow() {
        // 可以跳转到下单页面，并传入 itemID、数量等参数
        uni.navigateTo({
          url: `/pages/order/order?itemID=${encodeURIComponent(this.itemDetail.ItemID)}`,
        });
      },
      // 1. 拉取单个商品详情
      fetchItemDetail(itemID) {
        uni.request({
          url: `http://localhost:3000/items/${encodeURIComponent(itemID)}`,
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200) {
              this.itemDetail = res.data;
            } else {
              uni.showToast({
                title: '获取商品详情失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            console.error('fetchItemDetail error:', err);
            uni.showToast({
              title: '请求商品详情出错',
              icon: 'none'
            });
          },
        });
      },
      showQuantityModal() {
        this.isModalVisible = true;
        // 锁定页面滚动
      },
      closeModal() {
        this.isModalVisible = false;
        // 恢复页面滚动
      }
    },
    onLoad(options) {
      const itemID = options.itemID || '';
      if (itemID) {
        this.fetchItemDetail(itemID);
      } else {
        uni.showToast({
          title: '缺少商品 ID',
          icon: 'none'
        });
      }
    },
  };
</script>

<style lang="scss">
  /* 整体容器 */
  .detail-container {
    background-color: #ffffff;
    padding-bottom: 100rpx;
    /* 给底部按钮留空白 */
  }

  /* 顶部轮播图 */
  .detail-swiper {
    width: 100%;
    height: 500rpx;
    /* 根据需要调整 */
    background-color: #000000;
  }

  /* 轮播图内图片 */
  .detail-image {
    width: 100%;
    height: 100%;
  }

  /* 基本信息区域 */
  .info-section {
    background-color: #fff;
    padding: 30rpx;
    margin-top: 20rpx
      /* -100rpx */
    ;
    /* 与 swiper 叠加：如果想要图片与卡片有叠加效果，可调节 */
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  .item-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .price-row {
    flex-direction: row;
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;

    .price {
      font-size: 36rpx;
      color: #e64340;
      font-weight: bold;
    }

    .stock {
      font-size: 24rpx;
      color: #999;
      margin-left: 20rpx;
    }
  }

  .meta-row {
    flex-direction: row;
    display: flex;
    margin-bottom: 15rpx;

    .meta {
      font-size: 28rpx;
      color: #666;
      margin-right: 40rpx;
    }
  }

  .seller-row {
    margin-bottom: 0;

    .meta {
      font-size: 28rpx;
      color: #666;
    }
  }

  /* 分割线 */
  .divider {
    height: 20rpx;
    background-color: #ffffff;
  }

  /* 商品描述 */
  .desc-section {
    background-color: #fff;
    padding: 30rpx;
    margin-top: 20rpx;

    .desc-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .desc-content {
      font-size: 28rpx;
      color: #555;
      line-height: 42rpx;
    }
  }

  /* 底部动作按钮栏 */
  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    /* 占满屏幕宽度 */
    width: 100%;
    height: 100rpx;
    background-color: #fff;
    border-top: 1rpx solid #e5e5e5;
    display: flex;
    justify-content: center;
    /* 关键：水平居中 */
    padding: 0 40rpx;
    /* 两侧留白，避免按钮贴边 */
    box-sizing: border-box;
    /* 确保padding不影响总宽度 */
  }

  .btn-cart,
  .btn-buy {
    flex: 1;
    /* 等分两栏 */
    height: 95%;
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    border-radius: 20rpx;
    align-items: center;
    justify-content: center;
    display: flex;
    margin: 0;
  }

  /* 加入购物车按钮 */
  .btn-cart {
    background-color: #409eff;
  }

  /* 立即购买按钮 */
  .btn-buy {
    background-color: #67c23a;
  }

  /* 数量选择弹窗  */
  /* 数量选择弹窗 - 终极优化版 */
  .quantity-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    /* 加深背景遮罩 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    animation: fadeIn 0.3s ease;
    /* 添加淡入动画 */
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .modal-content {
    width: 80%;
    max-width: 550rpx;
    /* 适当加宽 */
    background-color: #fff;
    border-radius: 24rpx;
    /* 增大圆角 */
    overflow: hidden;
    box-shadow: 0 10rpx 50rpx rgba(0, 0, 0, 0.3);
    /* 增强阴影 */
    transform: translateY(0);
    animation: slideUp 0.3s ease;
    /* 添加上滑动画 */
  }

  @keyframes slideUp {
    from {
      transform: translateY(100rpx);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    padding: 32rpx;
    text-align: center;
    font-size: 34rpx;
    font-weight: 500;
    /* 中等粗细 */
    color: #333;
    border-bottom: 1rpx solid #f5f5f5;
  }

  .quantity-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50rpx 0;
    /* 增加垂直间距 */
  }

  .quantity-selector button {
    width: 88rpx;
    height: 88rpx;
    font-size: 44rpx;
    /* 新增居中属性 */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    line-height: 1; /* 重置行高 */
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .quantity-selector button:active {
    background-color: #e5e5e5;
    transform: scale(0.95);
    /* 点击缩放效果 */
  }

  .quantity-selector text {
    margin: 0 50rpx;
    font-size: 40rpx;
    min-width: 80rpx;
    text-align: center;
    font-weight: 500;
    color: #333;
    /* 数字加粗加深 */
  }

  .modal-actions {
    display: flex;
    border-top: 1rpx solid #f5f5f5;
  }

  .modal-actions button {
    flex: 1;
    height: 108rpx;
    font-size: 34rpx;
    border: none;
    background-color: transparent;
    transition: background-color 0.2s;
  }

  .modal-actions button:first-child {
    color: #666;
    font-weight: 500;
    border-right: 1rpx solid #f5f5f5;
  }

  .modal-actions button:first-child:active {
    background-color: rgba(0, 0, 0, 0.05);
    /* 点击反馈 */
  }

  .modal-actions button:last-child {
    color: #07C160;
  }

  .modal-actions button:last-child:active {
    background-color: rgba(7, 193, 96, 0.1);
  }
</style>