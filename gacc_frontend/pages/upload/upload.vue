<template>
  <view class="upload-container">
    <!-- 图片预览区域 -->
    <view class="image-preview-section">
      <image 
        v-if="tempImagePath" 
        :src="tempImagePath" 
        class="preview-image" 
        mode="aspectFill" 
      />
      <button v-else class="upload-btn" @click="chooseImage">
        + 上传商品图片
      </button>
    </view>

    <!-- 表单输入区域 -->
    <view class="form-section">
      <!-- 图片路径输入（新增单独表单项） -->
      <view class="form-item">
        <text class="form-label">图片路径</text>
        <input 
          v-model="item.ItemImage" 
          placeholder="例如: /static/items/example.jpg" 
          class="form-input"
        />
      </view>

      <!-- 其他表单项目 -->
      <view class="form-item">
        <text class="form-label">商品名称</text>
        <input v-model="item.ItemName" placeholder="请输入商品名称" class="form-input" />
      </view>
      
      <view class="form-item">
        <text class="form-label">所属游戏</text>
        <input v-model="item.GameName" placeholder="请输入游戏名称" class="form-input" />
      </view>
      
      <view class="form-item">
        <text class="form-label">商品类型</text>
        <input v-model="item.ItemType" placeholder="请输入商品类型" class="form-input" />
      </view>
      
      <view class="form-item">
        <text class="form-label">商品价格</text>
        <input v-model="item.Price" type="number" placeholder="0.00" class="form-input" />
      </view>
      
      <view class="form-item">
        <text class="form-label">商品库存</text>
        <input v-model="item.Stock" type="number" placeholder="0" class="form-input" />
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <button class="btn-submit" @click="submitItem">提交商品</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tempImagePath: '', // 临时预览路径
      item: {
        ItemName: '',
        GameName: '',
        ItemType: '',
        Price: '',
        Stock: '',
        ItemImage: '', // 最终提交的静态路径
        IsApproved: 0
      }
    };
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          // 仅用于预览，不存入提交数据
          this.tempImagePath = res.tempFilePaths[0];
          
          // 提示用户输入静态路径
          uni.showToast({
            title: '请填写图片正式路径',
            icon: 'none'
          });
        }
      });
    },
    
    submitItem() {
      // 提交前验证路径格式
      if (!this.validateImagePath()) return;
      
      const userID = this.$globalData.userID; 
      if (!userID) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
      }

      // 表单验证
      if (!this.validateForm()) return;

      this.item.SellerID = userID;

      uni.showLoading({ title: '提交中...' });
      
      uni.request({
        url: 'http://localhost:3000/items/upload',
        method: 'POST',
        data: this.item,
        success: (res) => {
          uni.hideLoading();
          if (res.statusCode === 200) {
            uni.showToast({ title: '商品上传成功', icon: 'success' });
            this.resetForm();
          } else {
            uni.showToast({ title: '上传失败: ' + res.data.message, icon: 'none' });
          }
        },
        fail: (err) => {
          uni.hideLoading();
          uni.showToast({ title: '请求失败', icon: 'none' });
          console.error('上传失败:', err);
        }
      });
    },
    
    validateImagePath() {
      if (!this.item.ItemImage) {
        uni.showToast({ title: '请填写图片路径', icon: 'none' });
        return false;
      }
      
      // 简单路径格式验证
      const validExtensions = ['.jpg', '.png', '.jpeg'];
      const hasValidExtension = validExtensions.some(ext => 
        this.item.ItemImage.toLowerCase().endsWith(ext)
      );
      
      if (!hasValidExtension) {
        uni.showToast({ 
          title: '路径需包含.jpg/.png扩展名', 
          icon: 'none' 
        });
        return false;
      }
      
      return true;
    },
    
    validateForm() {
      if (!this.item.ItemName.trim()) {
        uni.showToast({ title: '请输入商品名称', icon: 'none' });
        return false;
      }
      if (!this.item.ItemImage) {
        uni.showToast({ title: '请填写图片路径', icon: 'none' });
        return false;
      }
      if (!this.item.Price || Number(this.item.Price) <= 0) {
        uni.showToast({ title: '请输入有效价格', icon: 'none' });
        return false;
      }
      return true;
    },
    
    resetForm() {
      this.tempImagePath = '';
      this.item = {
        ItemName: '',
        GameName: '',
        ItemType: '',
        Price: '',
        Stock: '',
        ItemImage: '',
        IsApproved: 0
      };
    }
  }
};
</script>

<style lang="scss">
.upload-container {
  padding: 30rpx;
  padding-bottom: 120rpx;
  min-height: 100vh;
  background-color: #f7f7f7;
  box-sizing: border-box; /* 新增：防止padding影响宽度计算 */
}

/* 图片上传区域 */
.image-preview-section {
  width: calc(100% - 4rpx); /* 考虑边框宽度 */
  height: 300rpx;
  margin-bottom: 30rpx;
  background-color: #fff;
  border: 2rpx dashed #e5e5e5; /* 更精细的边框 */
  border-radius: 16rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box; /* 关键：包含边框在内计算宽度 */
}

/* 表单容器 */
.form-section {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx; /* 增加内边距 */
  margin-bottom: 30rpx;
  box-sizing: border-box; /* 关键 */
}

/* 表单项优化 */
.form-item {
  margin-bottom: 30rpx;
  width: 100%;
  
  &:last-child {
    margin-bottom: 0;
  }

  .form-label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
    width: 100%;
  }

  .form-input {
    width: 100%; /* 精确计算宽度 */
    height: 80rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: 2rpx solid #e5e5e5;
    border-radius: 8rpx;
    background-color: #fafafa;
    box-sizing: border-box; /* 关键 */
    
    &:focus {
      border-color: #409eff;
    }
  }
}

/* 底部按钮栏 */
.action-bar {
  position: fixed;
  width: 90%;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0rpx 0rpx; /* 左右增加内边距 */
  background-color: #fff;
  border-radius: 44rpx;
  margin: 0 auto;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  z-index: 100;

  .btn-submit {
    width: 100%;
    height: 88rpx;
    background-color: #67c23a;
    color: white;
    font-size: 32rpx;
    border-radius: 44rpx;
    border: none;
    box-sizing: border-box;
  }
}
</style>