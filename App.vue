<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef APP-NVUE
			plus.screen.lockOrientation('portrait-primary');
			// #endif
			
			uni.getSystemInfo({
				success(info) {
					// console.log('------------getSystemInfo----------', JSON.stringify(info));
					// console.log(JSON.stringify(info));
					// nvue 使用
					uni.setStorageSync('systemInfo', info)
				}	
			})
			
		},
		onShow: function() {
			console.log('App Show')
			// 检测密码
			uniCloud.callFunction({
			    name: 'first',
			    data: { 
					url: 'getPassword'
				}
			}).then(res => {
				const { data } = res.result
				const loginPwd = uni.getStorageSync('loginPwd') || ''
				uni.setStorageSync('cloudLoginPwd', data)
				if(data !== loginPwd) {
					uni.removeStorageSync('loginPwd')
					
					// 登录页面 不提示
					var pages = getCurrentPages()
					var page = (pages[pages.length - 1]).route
					if(page == 'pages/login/login') return
					
					!uni.isShowModal && uni.showModal({
					    title: '提示',
					    content: loginPwd 
							? '登录失效或密码错误，请重新登录'
							: '大人请先登录哦',
						showCancel: false,
					    success:  res => {
					        if (res.confirm) {
							    uni.reLaunch({
									url: '/pages/login/login'
							    })
					        } else if (res.cancel) {
					            console.log('用户点击取消')
					        }
							uni.isShowModal = false
					    }
					})
					uni.isShowModal = true
					
				}
				
			}).catch(err => {
				console.log('err', err)  
			})
			
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
