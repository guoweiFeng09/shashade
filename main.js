import Vue from 'vue'
import App from './App'

import request from '@/utils/request'

uni.appVersion = '1.0.3'
uni.$http = request

uni.showSToast = function (msg, duration = 1500) {
	uni.showToast({
		title: msg,
		icon: "none",
		duration
	})
}

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
