const animation = weex.requireModule('animation')
const dom = weex.requireModule('dom')
const BindingX = uni.requireNativePlugin('bindingx')

export default {
	data() {
		return {
			position: {
				x: 0,
				y: 0,
				initX: -750,
				initY: 0,
			},
			isInAnimation: false,
			randomMoveTimer: null,
			doubleClick: {
				lastTimeStamp: 0,
				isJudge: false
			},
			isStopWalk: false
		}
	},
	onShow(e) {
		console.log('stopRandomMove onShow')
		this.startRandomMove()
	
	},
	onHide() {
		console.log('stopRandomMove onHide')
		this.stopRandomMove()
	},
	methods: {
		initMoving() {
			this.avatarRotate()
			this.getAvatarPosition()
		},
		getAvatarPosition () {
			setTimeout(() => {
				const el = this.$refs.avatar2
				dom.getComponentRect(el, (e) => {
					this.position.initX = e.size.left
					this.position.initY = e.size.top
				})
			}, 100)
		},
		
		avatarRotate () {
			const el = this.$refs.ssd
			animation.transition(el, {
				styles: {
					transform: 'rotate(36000000deg)',
					transformOrigin: 'center center'
			    },
				duration: 999999999, //ms
				timingFunction: 'linear',
				delay: 0 //ms
			},  () => {})
			
		},
		getEl(el) {
			if (typeof el === 'string' || typeof el === 'number') return el;
			if (WXEnvironment) {
				return el.ref;
			} else {
				return el instanceof HTMLElement ? el : el.$el;
			}
		},
		vibrateShort() {
			// 震动两次
			setTimeout(() => {
				uni.vibrateShort({
				    success: function () {
						setTimeout(() => {
							uni.vibrateShort()
						}, 100)
				    }
				})
			}, 150)
		},
		
		async shake() {
			const el = this.getEl(this.$refs.avatarWrap)
			await shakeFunction(el, `linear(t,${this.position.x},-5,50)`, 50)
			await shakeFunction(el, `linear(t,${this.position.x-5},10,50)`, 50)
			await shakeFunction(el, `linear(t,${this.position.x+5},-5,50)`, 50)
			
			function shakeFunction(el, expression, duration) {
				return new Promise((resolve, reject) => {
					const props = [
						{
							element: el,
							expression,
							property: 'transform.translateX'
						},
					]
					const result = BindingX.bind(
						{
							anchor: el,
							eventType: 'timing',
							exitExpression: `t>${duration}`,
							props
						},
						e => {
							// nope
							if (e.state == 'end' || e.state == 'exit') {
								resolve()
							}
						}
					)
					
				})
			}
			
		},
		isDoubleClick(e) {
			if(this.isAvatarBacking) return
			let isDouble = false
			const now = e.timeStamp
			if(!this.doubleClick.isJudging && (now - this.doubleClick.lastTimeStamp < 700)) {
				isDouble = true
				this.handleDoubleClick()
				
				this.doubleClick.isJudging = true
				setTimeout(() => {
					this.doubleClick.isJudging = false
				}, 400)
			}else {
				isDouble = false
			}
			this.doubleClick.lastTimeStamp = now
			return isDouble
		},
		handleDoubleClick() {
			this.vibrateShort()
			this.shake()
			this.isStopWalk = !this.isStopWalk
			if(this.isStopWalk) {
				this.stopRandomMove()
				// this.back()
			}else {
				this.startRandomMove()
				
			}
		},
		touchmove(e) {
			if(this.isRandomMoving) return		
			if(this.isDoubleClick(e)) return
			if(this.isInAnimation) return
			
			// 处理 短暂点击事件 影响到双击
			const clickTimeStamp = new Date().getTime()
			
			this.isInAnimation = true
			const el = this.getEl(this.$refs.avatarWrap)
			const props = [
				{
					element: el,
					expression: `x+${this.position.x}`,
					property: 'transform.translateX'
				},
				{
					element: el,
					expression: `y+${this.position.y}`,
					property: 'transform.translateY'
				},
			]
			const result = BindingX.bind(
				{
					anchor: el, 
					eventType: 'pan',
					exitExpression: '',
					props
				},
				e => {
					// nope
					if (e.state == 'end') {
						this.position.x += e.deltaX
						this.position.y += e.deltaY
						if(new Date().getTime() - clickTimeStamp > 200) {
							this.back()
						}else {
							this.isInAnimation = false
						}
						if(result) {
							BindingX.unbind({
								token: result.token,
								eventType: 'pan'
							})
						}
					}
				}
			)
		},
		back() {
			this.isInAnimation = true
			this.isAvatarBacking = true
			const el = this.getEl(this.$refs.avatarWrap)
			
			// 随机 过渡时间/timingFunction
			const durationArr = [1000, 1500, 2000, 3000]
			const duration = durationArr[Math.floor(Math.random() * 100 + 1) % 4]
			
			const transitionArr = ['easeOutExpo', 'easeOutElastic',	'linear']
			const timingFunctionX = transitionArr[Math.floor(Math.random() * 100 + 1) % 3]
			const timingFunctionY = transitionArr[Math.floor(Math.random() * 100 + 1) % 3]
			
			const props = [
				{
					element: el,
					property: 'transform.translateX',
					expression: `${timingFunctionX}(t, ${this.position.x}, ${-this.position.x}, ${duration})`
				},
				{
					element: el,
					property: 'transform.translateY',
					expression: `${timingFunctionY}(t, ${this.position.y}, ${-this.position.y}, ${duration})`
				}
			]
			
			BindingX.bind(
				{
					anchor: el,
					eventType: 'timing',
					exitExpression: `t>${duration}`,
					props
				},
				e => {
					if (e.state == 'end' || e.state == 'exit') {
						// this.moveGesToken = e.token
						this.position.x -= this.position.x
						this.position.y -= this.position.y
						this.isInAnimation = false
						this.isAvatarBacking = false
					}
				}
			)
		},
		startRandomMove() {
			if(this.isStopWalk) return
			this.randomMoveTimer = setInterval(() => {
				this.randomMove()
			}, 10000)
		},
		stopRandomMove() {
			clearInterval(this.randomMoveTimer)
		},
		randomMove() {
			if(this.isInAnimation) return
			this.isInAnimation = true
			// if(this.isRandomMoving) return
			this.isRandomMoving = true
			
			// 随机 过渡时间/timingFunction
			const durationArr = [1200, 2000, 2500, 3000]
			const duration = durationArr[Math.floor(Math.random() * 100 + 1) % 4]
			
			const systemInfo = uni.getStorageSync('systemInfo') || {}
			const windowWidth = systemInfo.windowWidth
			const windowHeight = systemInfo.windowHeight
			// console.log('systemInfo', windowWidth, windowHeight, systemInfo)
			const rangeX = [-(this.position.initX + this.position.x) , windowWidth - (this.position.initX + this.position.x + 40 )]
			const rangeY= [-(this.position.initY + this.position.y), windowHeight - (this.position.initY + this.position.y + 40 )]
			
			const distanceX = Math.random() * (rangeX[1] - rangeX[0]) + rangeX[0]
			const distanceY = Math.random() * (rangeY[1] - rangeY[0]) + rangeY[0]
			
			const el = this.getEl(this.$refs.avatarWrap)
			const props = [
				{
					element: el,
					expression: `linear(t, ${this.position.x}, ${distanceX}, ${duration})`,
					property: 'transform.translateX'
				},
				{
					element: el,
					expression: `linear(t, ${this.position.y}, ${distanceY}, ${duration})`,
					property: 'transform.translateY'
				},
			]
			const result = BindingX.bind(
				{
					anchor: el,
					eventType: 'timing',
					exitExpression: `t>${duration}`,
					props
				},
				e => {
					// console.log('randomMove', e)
					// nope
					if (e.state == 'end' || e.state == 'exit') {
						this.position.x += distanceX
						this.position.y += distanceY
						// this.back()
						this.isInAnimation = false
						this.isRandomMoving = false
					}
				}
			)
		},
		
			
	}
 
}