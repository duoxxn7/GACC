<template>
  <view class="container">
    <view class="card register-card">
      <view class="card-header">
        <text class="card-title">用户注册</text>
      </view>
      <view class="card-body">
        <!-- 用户名 -->
        <view class="form-item">
          <text class="form-label">用户昵称</text>
          <input
            v-model="form.userID"
            class="uni-input form-input"
            type="text"
            placeholder="请输入用户昵称"
            maxlength="50"
          />
        </view>
        <!-- 用户姓名 -->
        <view class="form-item">
          <text class="form-label">用户姓名</text>
          <input
            v-model="form.userName"
            class="uni-input form-input"
            type="text"
            placeholder="请输入用户姓名"
            maxlength="20"
          />
        </view>
        <!-- 手机号 -->
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input
            v-model="form.phoneNumber"
            class="uni-input form-input"
            type="number"
            placeholder="请输入11位手机号"
            maxlength="11"
          />
        </view>
        
        <!-- 身份证号 -->
        <view class="form-item">
          <text class="form-label">身份证号</text>
          <input
            v-model="form.idNumber"
            class="uni-input form-input"
            type="idcard"
            placeholder="请输入18位身份证号"
            maxlength="18"
          />
        </view>
        
        <!-- 密码 -->
        <view class="form-item">
          <text class="form-label">密码</text>
          <input
            v-model="form.password"
            class="uni-input form-input"
            type="password"
            placeholder="请输入6-20位密码"
            maxlength="20"
          />
        </view>
        
        <!-- 确认密码 -->
        <view class="form-item">
          <text class="form-label">确认密码</text>
          <input
            v-model="form.confirmPassword"
            class="uni-input form-input"
            type="password"
            placeholder="请再次输入密码"
            maxlength="20"
          />
        </view>
        
        <!-- 角色选择 -->
        <view class="form-item">
          <text class="form-label">用户角色</text>
          <picker 
            @change="onRoleChange" 
            :value="roleIndex" 
            :range="roleOptions"
            class="role-picker"
          >
            <view class="picker">
              {{form.role || '请选择用户角色'}}
            </view>
          </picker>
        </view>
        
        <!-- 注册按钮 -->
        <button class="btn-register" @click="handleRegister">注册</button>
        
        <!-- 已有账号登录 -->
        <view class="login-link" @click="goToLogin">
          <text>已有账号？去登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        userID: '',
        userName: '',
        phoneNumber: '',
        idNumber: '',
        password: '',
        confirmPassword: '',
        role: ''
      },
      roleIndex: -1,
      roleOptions: ['用户','管理员']
    };
  },
  methods: {
    // 角色选择变化
    onRoleChange(e) {
      this.roleIndex = e.detail.value
      this.form.role = this.roleOptions[this.roleIndex]
    },
    
    // 表单验证
    validateForm() {
      if (!this.form.userID) {
        uni.showToast({ title: '请输入用户昵称', icon: 'none' })
        return false
      }
      
      if (!this.form.userName) {
        uni.showToast({ title: '请输入用户姓名', icon: 'none' })
        return false
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.form.phoneNumber)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return false
      }
      
      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.idNumber)) {
        uni.showToast({ title: '请输入正确的身份证号', icon: 'none' })
        return false
      }
      
      if (this.form.password.length < 6|| this.form.password.length > 20) {
        uni.showToast({ title: '密码长度需在6~20位之间', icon: 'none' })
        return false
      }
      
      if (this.form.password !== this.form.confirmPassword) {
        uni.showToast({ title: '两次输入的密码不一致', icon: 'none' })
        return false
      }
      
      if (!this.form.role) {
        uni.showToast({ title: '请选择用户角色', icon: 'none' })
        return false
      }
      
      return true
    },
    
    // 注册提交
    handleRegister() {
      if (!this.validateForm()) return
      
      uni.showLoading({ title: '注册中...' })
      
      // 这里替换为你的实际API地址
      uni.request({
        url: 'http://localhost:3000/register',
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: {
          UserID: this.form.userID,
          UserName: this.form.userName,
          PhoneNumber: this.form.phoneNumber,
          IDNumber: this.form.idNumber,
          Password: this.form.password,
          Role: this.form.role
        },
        success: (res) => {
          uni.hideLoading()
          if (res.statusCode === 200 && res.data.success) {
            uni.showToast({ title: '注册成功', icon: 'success' })
            setTimeout(() => {
              uni.switchTab({ url: '/pages/index/index' })
            }, 1500)
          } else {
            uni.showToast({ 
              title: res.data.message || '注册失败', 
              icon: 'none' 
            })
          }
        },
        fail: (err) => {
          uni.hideLoading()
          uni.showToast({ title: '请求出错', icon: 'none' })
          console.error(err)
        }
      })
    },
    
    // 跳转到登录页
    goToLogin() {
      uni.switchTab({ url: '/pages/index/index' })
    }
  }
};
</script>

<style>
/* 基础样式 */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

/* 卡片样式 */
.register-card {
  width: 98%;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.card-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.card-body {
  padding: 30rpx;
}

/* 表单样式 */
.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.form-input {
  width: 95%;
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  background-color: #fafafa;
}

/* 角色选择器 */
.role-picker {
  width: 95%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  background-color: #fafafa;
}

/* 注册按钮 */
.btn-register {
  width: 100%;
  height: 88rpx;
  margin-top: 40rpx;
  background-color: #67c23a;
  color: #fff;
  font-size: 32rpx;
  border-radius: 20rpx;
  border: none;
}

/* 登录链接 */
.login-link {
  margin-top: 30rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999;
  text-decoration: underline;
  padding: 10rpx 0;
}
</style>