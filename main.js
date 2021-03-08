import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

uni.appVersion = '1.0.1'

Vue.prototype.$host = 'https://unidemo.dcloud.net.cn/';

App.mpType = 'app'

uni.showSToast = function (msg, duration = 1500) {
	uni.showToast({
		title: msg,
		icon: "none",
		duration
	})
}

const app = new Vue({
    ...App
})
app.$mount()
