import Vue from 'vue'
import App from './App'

// 导入发送请求的库
import { $http } from '@escook/request-miniprogram'
// 挂载到uni上
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'
// 请求拦截器
$http.beforeRequest = function (options) {
  // 显示 loading 提示框,
  uni.showLoading({
    title: '数据加载中...',
  })
}
// 响应拦截器
$http.afterRequest = function () {
  // 隐藏 loading 提示框
  uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
