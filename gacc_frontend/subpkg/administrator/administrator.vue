<template>
  <view class="admin-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">管理员控制面板</text>
    </view>

    <!-- 选项卡 -->
    <view class="tabs">
      <button 
        :class="['tab-button', activeTab === 'users' ? 'active' : '']"
        @click="activeTab = 'users'"
      >用户管理</button>
      <button 
        :class="['tab-button', activeTab === 'items' ? 'active' : '']"
        @click="activeTab = 'items'"
      >商品审核</button>
      <button 
        :class="['tab-button', activeTab === 'products' ? 'active' : '']"
        @click="activeTab = 'products'"
      >商品管理</button>
    </view>

    <!-- 用户管理 -->
    <view v-if="activeTab === 'users'" class="section">
      <view class="search-bar">
        <input 
          v-model="userSearch" 
          placeholder="搜索用户名或手机号" 
          class="search-input"
        />
        <button @click="searchUsers" class="search-button">搜索</button>
      </view>

      <scroll-view scroll-y class="table-container">
        <table class="data-table">
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.UserID">
              <td>{{ user.UserName }}</td>
              <td>{{ user.PhoneNumber }}</td>
              <td>{{ user.Role }}</td>
              <td>{{ user.CreditLevel }}</td>
              <td :class="user.CreditLevel > 0 ? 'status-enabled' : 'status-disabled'">
                {{ user.CreditLevel > 0 ? '启用' : '禁用' }}
              </td>
              <td class="actions">
                <button @click="editUser(user)" class="btn-edit">编辑</button>
                <button 
                  @click="toggleUserStatus(user)"
                  :class="user.CreditLevel > 0 ? 'btn-disable' : 'btn-enable'"
                >
                  {{ user.CreditLevel > 0 ? '禁用' : '启用' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </scroll-view>
    </view>

    <!-- 商品审核 -->
    <view v-if="activeTab === 'items'" class="section">
      <view class="search-bar">
        <input 
          v-model="itemSearch" 
          placeholder="搜索商品名称或ID" 
          class="search-input"
        />
        <button @click="searchItems" class="search-button">搜索</button>
      </view>

      <scroll-view scroll-y class="table-container">
        <table class="data-table">
          <tbody>
            <tr v-for="item in filteredItems" :key="item.ItemID">
              <td>{{ item.ItemID }}</td>
              <td>{{ item.ItemName }}</td>
              <td>{{ item.GameName }}</td>
              <td>¥{{ item.Price }}</td>
              <td>{{ getSellerName(item.SellerID) }}</td>
              <td class="status-pending">待审核</td>
              <td class="actions">
                <button @click="approveItem(item)" class="btn-approve">通过</button>
                <button @click="showRejectDialog(item)" class="btn-reject">拒绝</button>
              </td>
            </tr>
          </tbody>
        </table>
      </scroll-view>
    </view>

    <!-- 商品管理 -->
    <view v-if="activeTab === 'products'" class="section">
      <view class="search-bar">
        <input 
          v-model="productSearch" 
          placeholder="搜索商品名称或ID" 
          class="search-input"
        />
        <button @click="searchProducts" class="search-button">搜索</button>
      </view>

      <scroll-view scroll-y class="table-container">
        <table class="data-table">
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.ItemID">
              <td>{{ product.ItemID }}</td>
              <td>{{ product.ItemName }}</td>
              <td>{{ product.GameName }}</td>
              <td>¥{{ product.Price }}</td>
              <td>{{ getSellerName(product.SellerID) }}</td>
              <td class="actions">
                <button @click="editProduct(product)" class="btn-edit">编辑</button>
                <button 
                  v-if="product.IsApproved"
                  @click="showDisableDialog(product)"
                  class="btn-disable"
                >
                  下架
                </button>
                <span v-else class="status-text">需重新审核</span>
              </td>
            </tr>
          </tbody>
        </table>
      </scroll-view>
    </view>

    <!-- 用户编辑模态框 -->
    <view v-if="showUserEditModal" class="modal">
      <view class="modal-content">
        <text class="modal-title">编辑用户信息</text>
        
        <view class="form-group">
          <text class="label">用户名</text>
          <input v-model="currentEdit.UserName" class="input" />
        </view>
        
        <view class="form-group">
          <text class="label">手机号</text>
          <input v-model="currentEdit.PhoneNumber" class="input" />
        </view>
        
        <view class="form-group">
          <text class="label">角色</text>
          <picker 
            @change="onRoleChange" 
            :value="currentEdit.Role === '管理员' ? 1 : 0" 
            :range="['普通用户', '管理员']"
          >
            <view class="picker">{{ currentEdit.Role }}</view>
          </picker>
        </view>
        
        <view class="form-group">
          <text class="label">信誉分</text>
          <input v-model="currentEdit.CreditLevel" type="number" class="input" />
        </view>
        
        <view class="button-group">
          <button @click="saveUser" class="btn-save">保存</button>
          <button @click="cancelEdit" class="btn-cancel">取消</button>
        </view>
      </view>
    </view>

    <!-- 商品编辑模态框 -->
    <view v-if="showProductEditModal" class="modal">
      <view class="modal-content">
        <text class="modal-title">编辑商品信息</text>
        
        <view class="form-group">
          <text class="label">商品名称</text>
          <input v-model="currentEdit.ItemName" class="input" />
        </view>
        
        <view class="form-group">
          <text class="label">游戏名称</text>
          <input v-model="currentEdit.GameName" class="input" />
        </view>
        
        <view class="form-group">
          <text class="label">商品类型</text>
          <input v-model="currentEdit.ItemType" class="input" />
        </view>
        
        <view class="form-group">
          <text class="label">价格</text>
          <input v-model="currentEdit.Price" type="number" class="input" />
        </view>
        
        <view class="form-group">
          <text class="label">库存</text>
          <input v-model="currentEdit.Stock" type="number" class="input" />
        </view>
        
        <view class="form-group">
          <text class="label">商品图片URL</text>
          <input v-model="currentEdit.ItemImage" class="input" />
        </view>
        
        <view class="button-group">
          <button @click="saveProduct" class="btn-save">保存</button>
          <button @click="cancelEdit" class="btn-cancel">取消</button>
        </view>
      </view>
    </view>

    <!-- 原因输入弹窗 -->
    <view v-if="showReasonDialog" class="modal">
      <view class="modal-content">
        <text class="modal-title">{{ dialogTitle }}</text>
        <textarea 
          v-model="reasonText" 
          placeholder="请输入原因..." 
          class="reason-input"
        />
        <view class="button-group">
          <button @click="confirmAction" class="btn-confirm">确认</button>
          <button @click="cancelAction" class="btn-cancel">取消</button>
        </view>
      </view>
    </view>

    <!-- 固定在底部的刷新按钮 -->
    <button class="refresh-button" @click="refresh">刷新数据</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'users',
      users: [],
      pendingItems: [],
      products: [],
      sellers: [],
      userSearch: '',
      itemSearch: '',
      productSearch: '',
      showUserEditModal: false,
      showProductEditModal: false,
      showReasonDialog: false,
      currentEdit: {},
      reasonText: '',
      dialogTitle: '',
      actionType: '' // 'disable' or 'enable' or 'reject' or 'disable-product'
    }
  },
  computed: {
    filteredUsers() {
      const search = this.userSearch.toLowerCase()
      return this.users.filter(user => 
        user.UserName.toLowerCase().includes(search) || 
        user.PhoneNumber.includes(search)
      )
    },
    filteredItems() {
      const search = this.itemSearch.toLowerCase()
      return this.pendingItems.filter(item => 
        item.ItemName.toLowerCase().includes(search) || 
        item.ItemID.toLowerCase().includes(search)
      )
    },
    filteredProducts() {
      const search = this.productSearch.toLowerCase()
      return this.products.filter(product => 
        product.ItemName.toLowerCase().includes(search) || 
        product.ItemID.toLowerCase().includes(search)
      )
    }
  },
  methods: {
    refresh(){
      this.fetchUsers();
      this.fetchItems();
      this.fetchProducts();
    },
    async fetchUsers() {
      try {
        const res = await uni.request({
          url: 'http://localhost:3000/admin/users',
          method: 'GET'
        });
        
        const response = Array.isArray(res) ? res[1].data : res.data;
        
        if (response.code === 200) {
          this.users = response.data;
        } else {
          throw new Error(response.message || '获取用户列表失败');
        }
      } catch (err) {
        console.error('获取用户列表出错:', err);
        uni.showToast({
          title: err.message || '获取用户列表失败',
          icon: 'none'
        });
      }
    },
    
    async fetchItems() {
      try {
        const res = await uni.request({
          url: 'http://localhost:3000/admin/items',
          method: 'GET'
        });
        
        const response = Array.isArray(res) ? res[1].data : res.data;
        
        if (response.code === 200) {
          this.pendingItems = response.data.items || [];
          this.sellers = response.data.sellers || [];
        } else {
          throw new Error(response.message || '获取商品列表失败');
        }
      } catch (err) {
        console.error('获取商品列表出错:', err);
        uni.showToast({
          title: err.message || '获取商品列表失败',
          icon: 'none'
        });
      }
    },
    
    async fetchProducts() {
      try {
        const res = await uni.request({
          url: 'http://localhost:3000/admin/products',
          method: 'GET'
        });
        
        const response = Array.isArray(res) ? res[1].data : res.data;
        
        if (response.code === 200) {
          this.products = response.data.products || [];
          this.sellers = response.data.sellers || [];
        } else {
          throw new Error(response.message || '获取商品列表失败');
        }
      } catch (err) {
        console.error('获取商品列表出错:', err);
        uni.showToast({
          title: err.message || '获取商品列表失败',
          icon: 'none'
        });
      }
    },
    
    getSellerName(sellerID) {
      const seller = this.sellers.find(s => s.UserID === sellerID);
      return seller ? seller.UserName : '未知卖家';
    },
    
    editUser(user) {
      this.currentEdit = {...user};
      this.showUserEditModal = true;
    },
    
    editProduct(product) {
      this.currentEdit = {...product};
      this.showProductEditModal = true;
    },
    
    toggleUserStatus(user) {
      this.currentEdit = {...user};
      this.actionType = user.CreditLevel > 0 ? 'disable' : 'enable';
      this.dialogTitle = user.CreditLevel > 0 ? '禁用用户' : '启用用户';
      this.showReasonDialog = true;
    },
    
    showDisableDialog(product) {
      this.currentEdit = {...product};
      this.actionType = 'disable-product';
      this.dialogTitle = '下架商品';
      this.showReasonDialog = true;
    },
    
    showRejectDialog(item) {
      this.currentEdit = {...item};
      this.actionType = 'reject';
      this.dialogTitle = '拒绝商品上架';
      this.showReasonDialog = true;
    },
    
    onRoleChange(e) {
      this.currentEdit.Role = ['普通用户', '管理员'][e.detail.value];
    },
    
    async saveUser() {
      try {
        const res = await uni.request({
          url: `http://localhost:3000/admin/users/${this.currentEdit.UserID}`,
          method: 'PUT',
          data: this.currentEdit
        });
        
        const response = Array.isArray(res) ? res[1] : res;
        
        if (response.statusCode === 200) {
          uni.showToast({
            title: '用户信息更新成功',
            icon: 'success'
          });
          this.fetchUsers();
          this.showUserEditModal = false;
        } else {
          throw new Error(response.data?.message || '更新用户信息失败');
        }
      } catch (err) {
        console.error('更新用户信息出错:', err);
        uni.showToast({
          title: err.message || '更新用户信息失败',
          icon: 'none'
        });
      }
    },
    
    async saveProduct() {
      try {
        const res = await uni.request({
          url: `http://localhost:3000/admin/items/${this.currentEdit.ItemID}`,
          method: 'PUT',
          data: {
            ItemName: this.currentEdit.ItemName,
            GameName: this.currentEdit.GameName,
            ItemType: this.currentEdit.ItemType,
            Price: this.currentEdit.Price,
            Stock: this.currentEdit.Stock,
            ItemImage: this.currentEdit.ItemImage
          }
        });
        
        const response = Array.isArray(res) ? res[1] : res;
        
        if (response.statusCode === 200) {
          uni.showToast({
            title: '商品信息更新成功',
            icon: 'success'
          });
          this.fetchProducts();
          this.showProductEditModal = false;
        } else {
          throw new Error(response.data?.message || '更新商品信息失败');
        }
      } catch (err) {
        console.error('更新商品信息出错:', err);
        uni.showToast({
          title: err.message || '更新商品信息失败',
          icon: 'none'
        });
      }
    },
    
    async approveItem(item) {
      try {
        const res = await uni.request({
          url: `http://localhost:3000/admin/items/${item.ItemID}/approve`,
          method: 'POST',
          data: {
            auditorID: this.$globalData.userID,
            auditResult: '通过',
            rejectReason: '符合上架标准'
          }
        });
        
        const response = Array.isArray(res) ? res[1] : res;
        
        if (response.statusCode === 200) {
          uni.showToast({
            title: '商品审核通过',
            icon: 'success'
          });
          this.fetchItems();
        } else {
          throw new Error(response.data?.message || '审核商品失败');
        }
      } catch (err) {
        console.error('审核商品出错:', err);
        uni.showToast({
          title: err.message || '审核商品失败',
          icon: 'none'
        });
      }
    },
    
    async confirmAction() {
      try {
        let url = '';
        let data = {};
        let successMessage = '';
        
        if (this.actionType === 'disable') {
          url = `http://localhost:3000/admin/users/${this.currentEdit.UserID}/disable`;
          data = { 
            reason: this.reasonText,
            adminID: this.$globalData.userID
          };
          successMessage = '用户禁用成功';
        } 
        else if (this.actionType === 'enable') {
          url = `http://localhost:3000/admin/users/${this.currentEdit.UserID}/enable`;
          data = { 
            reason: this.reasonText,
            adminID: this.$globalData.userID
          };
          successMessage = '用户启用成功';
        }
        else if (this.actionType === 'reject') {
          url = `http://localhost:3000/admin/items/${this.currentEdit.ItemID}/reject`;
          data = {
            auditorID: this.$globalData.userID,
            auditResult: '拒绝',
            rejectReason: this.reasonText
          };
          successMessage = '商品已拒绝上架';
        }
        else if (this.actionType === 'disable-product') {
          url = `http://localhost:3000/admin/items/${this.currentEdit.ItemID}/disable`;
          data = { 
            reason: this.reasonText,
            adminID: this.$globalData.userID
          };
          successMessage = '商品已下架，如需上架需重新审核';
        }
        
        const res = await uni.request({
          url,
          method: 'POST',
          data
        });
        
        const response = Array.isArray(res) ? res[1] : res;
        
        if (response.statusCode === 200) {
          uni.showToast({
            title: successMessage,
            icon: 'success'
          });
          
          if (this.actionType === 'reject') {
            this.fetchItems();
          } else if (this.actionType === 'disable-product') {
            this.fetchProducts();
          } else {
            this.fetchUsers();
          }
          
          this.showReasonDialog = false;
          this.reasonText = '';
        } else {
          throw new Error(response.data?.message || '操作失败');
        }
      } catch (err) {
        console.error('操作出错:', err);
        uni.showToast({
          title: err.message || '操作失败',
          icon: 'none'
        });
      }
    },
    
    cancelEdit() {
      this.showUserEditModal = false;
      this.showProductEditModal = false;
      this.currentEdit = {};
    },
    
    cancelAction() {
      this.showReasonDialog = false;
      this.reasonText = '';
    },
    
    searchUsers() {
      // 计算属性已处理搜索逻辑
    },
    
    searchItems() {
      // 计算属性已处理搜索逻辑
    },
    
    searchProducts() {
      // 计算属性已处理搜索逻辑
    }
  },
  onLoad() {
    this.fetchUsers();
    this.fetchItems();
    this.fetchProducts();
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20rpx;
  padding-bottom: 120rpx; /* 为底部按钮留出空间 */
  min-height: 100vh;
  font-size: 28rpx;
  position: relative;
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

.tabs {
  display: flex;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}

.tab-button {
  flex: 1;
  padding: 20rpx 0;
  background: none;
  border: none;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-button.active {
  color: #1989fa;
  font-weight: 500;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  right: 25%;
  height: 4rpx;
  background-color: #1989fa;
  border-radius: 2rpx;
}

.section {
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.search-bar {
  display: flex;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  margin-right: 10rpx;
  font-size: 28rpx;
  background-color: #f8f8f8;
}

.search-button {
  width: 140rpx;
  height: 70rpx;
  background-color: #1989fa;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.table-container {
  max-height: 60vh;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 20rpx;
  border: 1rpx solid #eee;
  text-align: center;
}

.data-table th {
  background-color: #f8f8f8;
  font-weight: bold;
}

.status-enabled {
  color: #67C23A;
}

.status-disabled {
  color: #F56C6C;
}

.status-pending {
  color: #E6A23C;
}

.status-text {
  color: #999;
  font-size: 26rpx;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions button {
  margin: 0 5rpx;
  padding: 8rpx 15rpx;
  font-size: 26rpx;
}

.btn-edit {
  background-color: #409EFF;
  color: white;
}

.btn-disable {
  background-color: #F56C6C;
  color: white;
}

.btn-enable {
  background-color: #67C23A;
  color: white;
}

.btn-approve {
  background-color: #67C23A;
  color: white;
}

.btn-reject {
  background-color: #F56C6C;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  background-color: white;
  border-radius: 10rpx;
  padding: 30rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  display: block;
  text-align: center;
}

.form-group {
  margin-bottom: 20rpx;
}

.label {
  display: block;
  margin-bottom: 10rpx;
  font-size: 28rpx;
}

.input {
  width: 100%;
  padding: 15rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.picker {
  padding: 15rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
}

.reason-input {
  width: 100%;
  height: 200rpx;
  padding: 15rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.btn-save, .btn-confirm {
  background-color: #409EFF;
  color: white;
}

.btn-cancel {
  background-color: #909399;
  color: white;
}

/* 固定在底部的刷新按钮 */
.refresh-button {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 30rpx;
  height: 80rpx;
  background-color: #1989fa;
  color: white;
  border-radius: 40rpx;
  font-size: 32rpx;
  z-index: 100;
  box-shadow: 0 4rpx 12rpx rgba(25, 137, 250, 0.3);
  border: none;
}
</style>