<template>
  <view class="container">
    <!-- 登录区域 -->
    <view v-if="log_status === 0" class="card login-card">
      <view class="card-body login-body">
        <input v-model="userID" class="uni-input form-input" type="text" autocomplete="off" placeholder="请输入账号" />
        <input v-model="password" class="uni-input form-input" type="text" autocomplete="off" placeholder="请输入密码" />
        <button class="btn-login" @click="log_in">登录</button>

        <view class="register-link" @click="goToRegister">
          <text>无账号，注册</text>
        </view>
      </view>
    </view>

    <!-- 已登录后显示用户信息 + 订单列表 -->
    <view v-else class="logged-container">
      <!-- 欢迎语 + 用户基本信息 -->
      <view class="user-info-card">
        <text class="user-info-title">用户信息</text>
        <view class="user-info-row"><text>用户 ID：</text><text>{{ userInfo.UserID }}</text></view>
        <view class="user-info-row"><text>用户名：</text><text>{{ userInfo.UserName }}</text></view>
        <view class="user-info-row"><text>手机号：</text><text>{{ userInfo.PhoneNumber }}</text></view>
        <view class="user-info-row"><text>角色：</text><text>{{ userInfo.Role }}</text></view>
        <view class="user-info-row"><text>信用等级：</text><text>{{ userInfo.CreditLevel }}</text></view>
        <view class="user-info-row"><text>交易历史：</text><text>{{ userInfo.TransactionHistory }}</text></view>
      </view>

      <!-- 订单列表 -->
      <view class="orders-card">
        <text class="orders-title">我的订单</text>
        <view v-if="orders.length === 0" class="empty-text">
          <text>暂无订单</text>
        </view>
        <scroll-view class="orders-list" scroll-y="true" style="max-height: 60vh;">
          <view v-for="order in orders" :key="order.OrderID" class="order-item">
            <view class="order-row">
              <text class="order-label">订单号：</text>
              <text class="order-value">{{ order.OrderID }}</text>
            </view>
            <view class="order-row">
              <text class="order-label">商品 ID：</text>
              <text class="order-value">{{ order.ItemID }}</text>
            </view>
            <view class="order-row">
              <text class="order-label">数量：</text>
              <text class="order-value">{{ order.Quantity }}</text>
            </view>
            <view class="order-row">
              <text class="order-label">金额：</text>
              <text class="order-value">{{ order.OrderAmount }}</text>
            </view>
            <view class="order-row">
              <text class="order-label">下单时间：</text>
              <text class="order-value">{{ order.OrderTime }}</text>
            </view>
            <view class="order-row">
              <text class="order-label">状态：</text>
              <text class="order-value">{{ order.OrderStatus }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="btns-bottom">
        <!--退出登录按钮-->
        <button class="btn-admin-control" v-if="userInfo.Role==='管理员'" @click="goToadmin">管理员界面</button>
        <!-- 退出登录按钮 -->
        <button class="btn-logout" @click="log_out">退出登录</button>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        users: [],
        log_status: 0,
        userID: '',
        password: '',
        // 新增两个字段用于存后端返回的“当前用户信息”和“当前用户订单”
        userInfo: {
          UserID: '',
          UserName: '',
          PhoneNumber: '',
          Role: '',
          CreditLevel: '',
          TransactionHistory: ''
        },
        orders: []
      };
    },
    methods: {
      fetchUsers() {
        uni.request({
          url: 'http://localhost:3000/user',
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200) {
              this.users = res.data;
            } else {
              uni.showToast({
                title: '请求失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            console.error(err);
            uni.showToast({
              title: '请求出错',
              icon: 'none'
            });
          }
        });
      },
      // 登录逻辑，登录成功后顺便拉取用户信息和订单
      log_in() {
        if (!this.userID || !this.password) {
          uni.showToast({
            title: '账号或密码不能为空',
            icon: 'none'
          });
          return;
        }
        uni.request({
          url: 'http://localhost:3000/login',
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            userID: this.userID,
            password: this.password
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data.success) {
              uni.showToast({
                title: '登录成功',
                icon: 'success'
              });
              // 更新登录状态
              this.log_status = 1;
              this.$globalData.log_status = 1;
              this.$globalData.userID = this.userID;
              this.$globalData.password = this.password; // 建议实际项目不要保存明文密码
              this.$globalData.role = this.Role;
              uni.setStorageSync('log_status', 1);

              // 登录成功后，拉取用户信息和订单
              this.fetchUserInfo();
              this.fetchOrders();
            } else {
              uni.showToast({
                title: '账号或密码错误',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            console.error(err);
            uni.showToast({
              title: '请求出错',
              icon: 'none'
            });
          }
        });
      },
      // 退出登录时清空所有相关数据
      log_out() {
        this.$globalData.log_status = 0;
        this.$globalData.userID = '';
        this.$globalData.password = '';
        this.userID = '';
        this.password = '';
        this.userInfo = {
          UserID: '',
          UserName: '',
          PhoneNumber: '',
          Role: '',
          CreditLevel: '',
          TransactionHistory: ''
        };
        this.orders = [];
        uni.removeStorageSync('log_status');
        this.log_status = 0;
      },
      goToRegister() {
        uni.navigateTo({
          url: '/subpkg/register/register'
        });
      },
      goToadmin() {
        uni.navigateTo({
          url: '/subpkg/administrator/administrator'
        });
      },
      // 新增：根据当前 this.userID 去后端 /users/:id 拿用户信息
      fetchUserInfo() {
        const id = this.userID;
        if (!id) return;
        uni.request({
          url: `http://localhost:3000/users/${encodeURIComponent(id)}`,
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200) {
              // res.data 就是用户对象
              this.userInfo = res.data || {};
            } else {
              uni.showToast({
                title: '获取用户信息失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            console.error('fetchUserInfo error:', err);
            uni.showToast({
              title: '获取用户信息出错',
              icon: 'none'
            });
          }
        });
      },
      // 新增：根据当前 this.userID 去后端 /orders?buyerID=xxx 拿该用户订单
      fetchOrders() {
        const buyerID = this.userID;
        if (!buyerID) return;
        uni.request({
          url: 'http://localhost:3000/orders',
          method: 'GET',
          data: {
            buyerID: buyerID
          },
          success: (res) => {
            if (res.statusCode === 200) {
              this.orders = res.data || [];
            } else {
              uni.showToast({
                title: '获取订单列表失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            console.error('fetchOrders error:', err);
            uni.showToast({
              title: '获取订单出错',
              icon: 'none'
            });
          }
        });
      }
    },
    onLoad() {
      // 首次页面加载时，从全局或本地缓存同步 log_status

      this.log_status = this.$globalData.log_status;
      this.$globalData.log_status = this.log_status;
      // 如果已经登录，就拉一次用户信息和订单
      if (this.log_status === 1) {
        this.userID = this.$globalData.userID || '';
        if (this.userID) {
          this.fetchUserInfo();
          this.fetchOrders();
        }
      }
    }
  };
</script>

<style>
  /* 整体容器 */
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f2f2f2;
    padding: 0 20rpx;
    min-height: 100vh;
  }

  /* ------------ 页面容器 ------------- */
  .page-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* 垂直居中 */
    align-items: center;
    /* 水平居中 */
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 24rpx;
    box-sizing: border-box;
  }

  /* ------------ 登录卡片 ------------- */
  .login-card {
    width: 94%;
    position: absolute;
    bottom: 40%;
    /* 通过调整这个值控制垂直位置 */
    left: 0;
    right: 0;
    margin: 0 auto;
    /* 水平居中 */
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
  }

  .login-body {
    padding: 20rpx;
    /* 增加内边距 */
    box-sizing: border-box;
    /* 确保内边距不影响总宽度 */
  }

  /* 输入框样式 */
  .form-input {
    width: 90%;
    /* 考虑内边距 */
    height: 80rpx;
    margin: 0 auto 24rpx;
    /* 水平居中 */
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 1rpx solid #dcdce0;
    border-radius: 20rpx;
    background-color: #fafafa;
    display: block;
    /* 确保宽度生效 */
  }

  /* 登录按钮 */
  .btn-login {
    width: 90%;
    /* 考虑内边距 */
    height: 88rpx;
    margin: 0 auto;
    /* 水平居中 */
    background-color: #67c23a;
    color: #fff;
    font-size: 30rpx;
    font-weight: 500;
    border: none;
    border-radius: 20rpx;
    display: block;
    /* 确保宽度生效 */
  }

  /* 注册链接 */
  .register-link {
    margin-top: 20rpx;
    text-align: center;
    font-size: 24rpx;
    color: #666;
    padding: 10rpx 0;
  }

  .register-link text {
    display: inline-block;
    padding: 5rpx 10rpx;
    text-decoration: underline;
  }

  /* --------- 已登录 后显示区域 --------- */
  .logged-container {
    width: 98%;
    margin-top: 24rpx;
  }

  /* 用户信息卡片 */
  .user-info-card {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
    margin-bottom: 24rpx;
  }

  .user-info-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .user-info-row {
    flex-direction: row;
    margin-bottom: 12rpx;
  }

  .user-info-row text:first-child {
    font-size: 28rpx;
    color: #555;
  }

  .user-info-row text:last-child {
    font-size: 28rpx;
    color: #888;
  }

  /* 订单列表卡片 */
  .orders-card {
    height: 700rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
    margin-bottom: 24rpx;
  }

  .orders-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .orders-list {
    height: 680rpx;
    width: 100%;
  }

  .order-item {
    background-color: #fafafa;
    border-radius: 6rpx;
    padding: 16rpx;
    margin-bottom: 16rpx;
  }

  .order-row {
    flex-direction: row;
    margin-bottom: 8rpx;
  }

  .order-label {
    font-size: 26rpx;
    color: #555;
    width: 90rpx;
  }

  .order-value {
    font-size: 26rpx;
    color: #888;
  }

  /* 空状态提示 */
  .empty-text {
    justify-content: center;
    align-items: center;
    height: 120rpx;
  }

  .empty-text text {
    color: #999;
    font-size: 28rpx;
  }

  /* 底部按钮容器 */
  .btns-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    padding-bottom: 30rpx;
    background: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
    display: flex;
    /* 添加 flex 布局 */
    justify-content: space-between;
    /* 按钮横向分布 */
    align-items: center;
    /* 垂直居中 */
    box-sizing: border-box;
    /* 确保 padding 不影响宽度 */
  }

  /* 通用按钮样式 */
  .btns-bottom .btn-admin-control,
  .btns-bottom .btn-logout {
    width: 48%;
    /* 保持宽度不变 */
    height: 80rpx;
    color: #ffffff;
    font-size: 30rpx;
    font-weight: 500;
    border: none;
    border-radius: 20rpx;
    margin-bottom: 0;
    /* 移除底部 margin */
  }

  /* 管理员按钮单独样式 */
  .btns-bottom .btn-admin-control {
    background-color: #409eff;
  }

  /* 退出登录按钮单独样式 */
  .btns-bottom .btn-logout {
    background-color: #ff4d4f;
  }
</style>