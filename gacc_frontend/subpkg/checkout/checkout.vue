<template>
  <view class="checkout-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">订单结算</text>
    </view>

    <!-- 商品列表 -->
    <scroll-view scroll-y class="items-container">
      <view v-for="item in items" :key="item.ItemID" class="item-card">
        <image :src="item.ItemImage" class="item-image" />
        <view class="item-info">
          <text class="item-name">{{ item.ItemName }}</text>
          <text class="game-name">{{ item.GameName }}</text>
          <view class="price-section">
            <text class="price">¥{{ item.Price }}</text>
            <text class="quantity">x{{ item.Quantity }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 订单总金额 -->
    <view class="total-section">
      <text class="total-label">订单总金额:</text>
      <text class="total-amount">¥{{ totalAmount }}</text>
    </view>

    <!-- 支付方式选择 -->
    <view class="payment-methods">
      <text class="section-title">选择支付方式</text>
      <radio-group @change="paymentMethodChange">
        <label class="method-item" v-for="method in paymentMethods" :key="method.value">
          <view class="method-left">
            <image :src="method.icon" class="method-icon" />
            <text class="method-name">{{ method.name }}</text>
          </view>
          <radio :value="method.value" :checked="selectedMethod === method.value" color="#1989fa" />
        </label>
      </radio-group>
    </view>

    <!-- 底部支付按钮 -->
    <view class="footer">
      <button class="pay-button" @click="confirmPayment" :disabled="!selectedMethod">
        确认支付 ¥{{ totalAmount }}
      </button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        items: [], // 从购物车传递过来的商品
        paymentMethods: [{
            name: '微信支付',
            value: 'wechat',
            icon: '/static/payment/wechat.png'
          },
          {
            name: '支付宝',
            value: 'alipay',
            icon: '/static/payment/alipay.png'
          },
          {
            name: '余额支付',
            value: 'balance',
            icon: '/static/payment/balance.png'
          }
        ],
        selectedMethod: '', // 当前选中的支付方式
        orderData: [], // 存储生成的订单数据
        transactionData: [] // 存储生成的交易数据
      }
    },
    computed: {
      // 计算订单总金额
      totalAmount() {
        return this.items.reduce((total, item) => {
          return total + (item.Price * item.Quantity)
        }, 0).toFixed(2)
      },
      // 获取选中的支付方式名称
      selectedMethodName() {
        const method = this.paymentMethods.find(m => m.value === this.selectedMethod)
        return method ? method.name : ''
      }
    },
    onLoad(options) {
      // 从购物车页面接收传递的商品数据
      if (options.items) {
        this.items = JSON.parse(decodeURIComponent(options.items))
      }
    },
    methods: {
      // 生成订单和交易数据
      generateOrderData() {
        const timestamp = Date.now().toString(36) /* .slice(-6) */ ; // 时间戳取6位
        const randomStr = Math.random().toString(36).substr(2, 4); // 随机数取4位

        this.orderData = this.items.map(item => {
          // 截取ItemID后8位（如果长度>8），否则保留原ID
          const shortItemID = item.ItemID.length > 8 ?
            item.ItemID.slice(-8) :
            item.ItemID;

          return {
            OrderID: `ORD_${timestamp}_${randomStr}_${shortItemID}`,
            ItemID: item.ItemID, // 原始ID保持不变
            Quantity: item.Quantity,
            OrderAmount: (item.Price * item.Quantity).toFixed(2),
            OrderTime: new Date().toISOString()
          }
        });

        this.transactionData = this.items.map(item => {
          const shortItemID = item.ItemID.length > 8 ?
            item.ItemID.slice(-8) :
            item.ItemID;

          return {
            TransactionID: `TRX_${timestamp}_${randomStr}_${shortItemID}`,
            OrderID: `ORD_${timestamp}_${randomStr}_${shortItemID}`,
            PaymentMethod: this.selectedMethod,
            TransactionTime: new Date().toISOString()
          }
        });
      },

      // 支付方式选择变化
      paymentMethodChange(e) {
        this.selectedMethod = e.detail.value
      },

      // 确认支付按钮点击
      confirmPayment() {
        uni.showModal({
          title: '确认支付',
          content: `确认使用${this.selectedMethodName}支付 ¥${this.totalAmount} 吗？`,
          success: (res) => {
            if (res.confirm) {
              this.processPayment()
            } else if (res.cancel) {
              this.cancelPayment()
            }
          }
        })
      },

      // 处理支付逻辑
      async processPayment() {
        uni.showLoading({
          title: '支付处理中...'
        })

        try {
          // 1. 生成订单数据
          this.generateOrderData()
          // 2. 批量创建订单
          const orderRes = await this.createOrders()
          if (!orderRes.success) {
            throw new Error(orderRes.message || '创建订单失败')
          }
          // 3. 批量创建交易记录（支付成功）
          const transactionRes = await this.createTransactions('成功')
          if (!transactionRes.success) {
            throw new Error(transactionRes.message || '创建交易记录失败')
          }
          // 4. 清空购物车中已购买的商品
          await this.clearPurchasedItems()
          uni.hideLoading()
          // 支付成功跳转到购物车列表页
          uni.switchTab({
            url: '/pages/cart/cart'
          })
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          })
        } catch (err) {
          uni.hideLoading()
          console.error('支付出错:', err)
          // 如果订单创建成功但交易失败，需要更新订单状态
          if (this.orderData.length > 0) {
            await this.updateOrdersStatus('支付失败')
          }
          uni.showToast({
            title: err.message || '支付失败',
            icon: 'none'
          })
        }
      },

      // 批量创建订单
      async createOrders() {
        try {
          const res = await uni.request({
            url: 'http://localhost:3000/orders/batch',
            method: 'POST',
            data: {
              BuyerID: this.$globalData.userID,
              Orders: this.orderData,
              PaymentMethod: this.selectedMethod
            }
          })
          const response = Array.isArray(res) ? res[1].data : res.data
          return response
        } catch (err) {
          console.error('创建订单出错:', err)
          return {
            success: false,
            message: '创建订单失败'
          }
        }
      },

      // 批量创建交易记录
      async createTransactions(status, reason = '') {
        try {
          const transactionStatus = status === '成功' ? '成功' : `失败: ${reason}`.substring(0, 50);

          const res = await uni.request({
            url: 'http://localhost:3000/transactions/batch',
            method: 'POST',
            data: {
              Transactions: this.transactionData.map(trx => ({
                TransactionID: String(trx.TransactionID).substring(0, 50),
                OrderID: String(trx.OrderID).substring(0, 50),
                PaymentMethod: String(trx.PaymentMethod).substring(0, 20),
                TransactionTime: new Date(trx.TransactionTime || new Date()).toISOString(),
                TransactionStatus: transactionStatus
              }))
            }
          });

          if (!res.data.success) {
            throw new Error(res.data.message || '创建交易记录失败');
          }
          return res.data;
        } catch (err) {
          console.error('创建交易记录出错:', err);
          throw err;
        }
      },
      // 批量更新订单状态
      async updateOrdersStatus(status) {
        try {
          await uni.request({
            url: 'http://localhost:3000/orders/batch/status',
            method: 'PUT',
            data: {
              OrderIDs: this.orderData.map(order => order.OrderID),
              OrderStatus: status
            }
          })
        } catch (err) {
          console.error('更新订单状态出错:', err)
        }
      },
      // 清空购物车中已购买的商品
      async clearPurchasedItems() {
        try {
          const itemIDs = this.items.map(item => item.ItemID)

          await uni.request({
            url: `http://localhost:3000/cart/clear-purchased/${this.$globalData.userID}`,
            method: 'POST',
            data: {
              itemIDs: itemIDs
            }
          })
        } catch (err) {
          console.error('清空购物车商品出错:', err)
        }
      },

      // 取消支付
      cancelPayment() {
        uni.showModal({
          title: '取消支付',
          content: '请输入取消支付的原因',
          editable: true,
          placeholderText: '请输入取消原因',
          success: (res) => {
            if (res.confirm && res.content) {
              this.submitCancelReason(res.content)
            }
          }
        })
      },

      // 提交取消支付原因
      async submitCancelReason(reason) {
        if (!reason) {
          uni.showToast({
            title: '请填写取消原因',
            icon: 'none'
          })
          return
        }
        uni.showLoading({
          title: '处理中...'
        })
        try {
          // 1. 生成订单数据
          this.generateOrderData()
          // 2. 批量创建订单
          const orderRes = await this.createOrders()
          if (!orderRes.success) {
            throw new Error(orderRes.message || '创建订单失败')
          }
          // 3. 批量创建交易记录（失败状态）
          const transactionRes = await this.createTransactions('失败', reason)
          if (!transactionRes.success) {
            throw new Error(transactionRes.message || '创建交易记录失败')
          }
          // 4. 更新订单状态为已取消
          await this.updateOrdersStatus('已取消')
          uni.hideLoading()
          // 返回购物车页面
          uni.navigateBack({
            delta: 1
          })
          uni.showToast({
            title: '已取消支付',
            icon: 'none'
          })
        } catch (err) {
          uni.hideLoading()
          console.error('取消支付出错:', err)
          uni.showToast({
            title: err.message || '取消支付失败',
            icon: 'none'
          })
        }
      }
    }
  }
</script>

<style scoped>
  .checkout-container {
    padding: 20rpx;
    padding-bottom: 120rpx;
    min-height: 100vh;
    background-color: #f7f7f7;
  }

  .header {
    padding: 30rpx 0;
    text-align: center;
    border-bottom: 1rpx solid #eee;
    margin-bottom: 20rpx;
  }

  .title {
    font-size: 36rpx;
    font-weight: bold;
  }

  .items-container {
    max-height: 40vh;
    margin-bottom: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
  }

  .item-card {
    display: flex;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f5f5f5;
  }

  .item-card:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .item-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .item-name {
    font-size: 30rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 10rpx;
  }

  .game-name {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 20rpx;
  }

  .price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price {
    font-size: 32rpx;
    color: #e64340;
    font-weight: bold;
  }

  .quantity {
    font-size: 28rpx;
    color: #999;
  }

  .total-section {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
  }

  .total-label {
    font-size: 28rpx;
    color: #666;
    margin-right: 15rpx;
  }

  .total-amount {
    font-size: 36rpx;
    color: #e64340;
    font-weight: bold;
  }

  .payment-methods {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
  }

  .section-title {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
  }

  .method-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
  }

  .method-item:last-child {
    border-bottom: none;
  }

  .method-left {
    display: flex;
    align-items: center;
  }

  .method-icon {
    width: 50rpx;
    height: 50rpx;
    margin-right: 20rpx;
  }

  .method-name {
    font-size: 30rpx;
    color: #333;
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20rpx;
    background-color: #fff;
    box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.08);
  }

  .pay-button {
    height: 90rpx;
    line-height: 90rpx;
    background-color: #1989fa;
    color: white;
    border-radius: 45rpx;
    font-size: 32rpx;
  }

  .pay-button[disabled] {
    background-color: #c8c9cc;
  }
</style>