import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

uni.appVersion = '1.0.3'

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
