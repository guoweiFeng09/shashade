import updateView from '@/components/update'

export default {
	components: {
		updateView
	},
	data() {
		return {
			update: {
				isShow: false
			}
		}
	},
	onShow(e) {
	
	},
	onHide() {
	},
	methods: {
		checkUpdate() {
			console.log('checkUpdate')
			uni.$http({
			    name: 'first',
			    data: { 
					url: 'getVersion'
				}
			}).then(res => {
				const {lastVerson, downloadUrl} = res.result
				if(lastVerson > uni.appVersion) {
					uni.showModal({
					    title: '大人',
					    content: '小的检测到有更新, 要不要更新呀',
					    success:  res => {
					        if (res.confirm) {
								this.update.isShow = true
								this.$nextTick(() => {
									this.$refs.updateView.updateApp(downloadUrl)
								})
					        } else if (res.cancel) {
					            console.log('用户点击取消')
					        }
					    }
					})
				}
			}).catch(err => {
				console.log('err', err)  
			})
		},
			
	}
 
}