
let loadingNum = 0
export default async function(data, config = {}) {
	const {
		noLoading,
		needError,
		noSign,
	} = config
	
	if(!noLoading) {
		uni.showLoading()
		loadingNum++
	}
	
	if(!data.data) {
		data.data = {}
	}
	data.data.sessionId = uni.getStorageSync('sessionId') || ''
	
	return new Promise(async (resolve, reject) => {
		await uniCloud.callFunction(data).then(res => {
			// console.log('uniCloud.callFunction', res)
			resolve(res)
		}).catch(err => {
			console.log('err', err) 
			reject(err)
		})
		if(!noLoading) {
			loadingNum--
			if(!loadingNum) uni.hideLoading()
		}
	})
}


