'use strict'
// const db = uniCloud.database()
const UniPush = require('uni-push')
const util = require('../utils/tool.js')
// 表名称
const collection = 'todo'

module.exports = async () => {
	// 查询 todoList
	// const dbData = await db.collection(collection).where({done: 0}).orderBy("time", "asc").get()
	// if(dbData.data.length < 1) return 'list empty'
	// // 距过期时间 天数
	// const expiredDistance = 3600 * 24 * 1000 *  7 // 7-天数
	// const pushArr = dbData.data.filter(item => new Date(item.time).getTime() - new Date().getTime() + 8 * 3600 * 1000 < expiredDistance)
	// let msg = pushArr.map(item => item.title).join('、')
	const title = 'ToDo更新提醒'
	const content = `ToDo有新消息。傻傻的快去看看哦`
	
	const pushData = {
		title,
		content,
		payload: JSON.stringify({
			title,
			content,
			data:{
				type: 1,
				// content: pushArr,
			},
			payload:{
				type: 1,
				t: new Date().getTime()
			}
		}),
		// clientid:'2bea043336c3e3f8c00bdac8b55c0c5a'
	}
	// console.log('pushArr', pushArr)
	// console.log('pushData', pushData)
	
	//单推
	// return await UniPush("toSingle", pushData)
	//群推
	return await UniPush("toApp", pushData)
	
	// let res = get()
	// console.log('离线时显示的标题', res)
	//单推
	// return await UniPush("toSingle", {
	// 	"title": "离线时显示的标题",
	// 	"content": "离线时显示的副标题",
	// 	"payload": JSON.stringify({
	// 		"title": "在线时显示的标题",
	// 		"content": "在线时显示的副标题",
	// 		"data":{
	// 			"username":"uni-app",
	// 			"text":"这是透传的数据data的里面的内容"
	// 		},
	// 		payload:{type:1,fId:1,t: new Date().getTime()}
	// 	}),
	// 	"clientid":'2bea043336c3e3f8c00bdac8b55c0c5a',
	// 	//用户单clientid 来源 plus.push.getClientInfo()  http://www.html5plus.org/doc/zh_cn/push.html#plus.push.getClientInfo
	// })
	
	
	//群推
	// return await UniPush("toApp",{
	// 	"title" : "清明节",
	// 	"content" : "傻傻的。终于调通了。啦啦啦。我们去吃饭好不好呀",
	// 	// "payload" : JSON.stringify({data:"【群推】数据" + new Date().getTime()}) 
	// 	// "payload" : JSON.stringify({title:"标题",content:"内容",payload:{type:1,fId:1,t: new Date().getTime()}})
	// 	"payload" : JSON.stringify({title:"【测试】",content:"你是真的傻傻的呀~",payload:{type:1,fId:1,t: new Date().getTime()}})
	// })
}

