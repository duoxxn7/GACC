import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
 // 添加 uni-transition 组件
//import { uniPopup, uniPopupDialog, uniTransition } from '@dcloudio/uni-ui'
/*Vue.component('uni-popup', uniPopup)
Vue.component('uni-popup-dialog', uniPopupDialog)
Vue.component('uni-transition', uniTransition) */

Vue.config.productionTip = false

// 定义全局变量
Vue.prototype.$globalData = {
  log_status: 0, // 从本地存储初始化
  userID: '',
  password: '',
  role:'',
}

App.mpType = 'app'
const app = new Vue({

  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif