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
			
			
			console.log('plus.push.getClientInfo()', plus.push.getClientInfo())
			
			plus.push.addEventListener('click', function(msg){
				// 分析msg.payload处理业务逻辑 
				console.log( 'You clicked: ', msg);
			}, false );
			
			plus.push.addEventListener('receive', function(msg){
				// 分析msg.payload处理业务逻辑 
				console.log( 'You receive: ', msg);
			}, false );
			
			
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
