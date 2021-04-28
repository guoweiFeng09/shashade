'use strict'
const util = require('../utils/tool.js')
// 表名称
const collection = 'todo'
// 业务操作成功
const successRes = {
	msg: 'ok',
	code: 0
}
// 业务表操作失败
const failRes = {
	msg: 'fail',
	code: -1
}

module.exports = async (db, event) => {
	const { url, data } = event
	
	switch(url) {
		case 'addTodoItem':
			return add(db, data, event)
			break
		case 'removeTodoItem':
			return remove(db, data)
			break
		case 'updateTodoItem':
			return update(db, data, event)
			break
		case 'getTodoList':
			return get(db, data)
			break
		case 'getTodoListDone':
			return getdone(db, data)
			break
		case 'getTodoItem':
			return getById(db, data)
			break
		case 'updateTodoItemComplete':
			return todoItemComplete(db, data, event)
			break
		
	}
}

async function add(db, data, event) {
	data = data || {}
	data.id = '' + parseInt(Math.random() * 10000) + new Date().getTime()
	data.done = 0
	const dbData = await db.collection(collection).add(data)
	const isSuceess = dbData.id
	const res = isSuceess ? successRes : failRes
	// console.log('add', data, dbData)
	// todoUpdatePush() //更新推送
	await formatDataToPush(db, event)
	return res
}

async function remove(db, data) {
	const { id } = data
	const dbData = await db.collection(collection).where({id}).remove()
	const isSuceess = dbData.affectedDocs
	const res = isSuceess ? successRes : failRes
	// console.log('remove', data, dbData, res)
	return res
}

async function update(db, data, event) {
	const { id } = data
	const dbData = await db.collection(collection).where({id}).update(data)
	const isSuceess = dbData.affectedDocs
	// const res = isSuceess ? successRes : failRes
	const res = successRes
	
	// console.log('update', data, dbData, res)
	// todoUpdatePush(group) //更新推送
	await formatDataToPush(db, event)
	return res
}

async function todoItemComplete(db, data, event) {
	const { id } = data
	const dbData = await db.collection(collection).where({id}).update({
	  done: 1,
	  completeTime: util.timeFormat(new Date().getTime() + 8 * 3600 * 1000, 'yyyy-MM-dd hh:mm:ss')
	})
	const isSuceess = dbData.affectedDocs
	const res = isSuceess ? successRes : failRes
	// console.log('update', data, dbData, res)
	// todoUpdatePush() //更新推送
	await formatDataToPush(db, event)
	return res
}

async function get(db, data) {
	// const { id } = data
	const dbData = await db.collection(collection).where({done: 0}).orderBy("time", "asc").get()
	const isSuceess = dbData.data
	let res = failRes
	if(isSuceess) {
		successRes.data = dbData.data
		res = successRes
	}
	
	// console.log('get', res)
	return res
}

async function getdone(db, data) {
	// const { id } = data
	const dbData = await db.collection(collection).where({done: 1}).orderBy("completeTime", "desc").get()
	const isSuceess = dbData.data
	let res = failRes
	if(isSuceess) {
		successRes.data = dbData.data
		res = successRes
	}
	
	// console.log('get', res)
	return res
}

async function getById(db, data) {
	const { id } = data
	const dbData = await db.collection(collection).where({id}).get()
	const isSuceess = dbData.data
	let res = failRes
	if(isSuceess) {
		successRes.data = dbData.data
		res = successRes
	}
	
	return res
}

async function todoUpdatePush(data) {
	await uniCloud.callFunction({name: "todoUpdatePush", data})
}

async function formatDataToPush(db, event) {
	const { data, sessionId } = event
	const userDB = await db.collection('user').where({sessionId}).get()
	const user = userDB.data && userDB.data[0]
	// const groupDB = await db.collection('group').where({
	// 	groupId: user.groupId,
	// 	mobile: db.command.neq(user.mobile)
	// }).get()
	const groupDB = await db.collection('group').where({
		mobile: user.mobile
	}).get()
	const group = groupDB.data
	if(group) {
		for(let i = 0; i < group.length; i++) {
			let item = group[i]
			item.title = 'ToDo更新提醒'
			item.content = `ToDo有新消息。${item.nick}快去看看哦`
			item.editTime = util.getTimeNow()
			console.log('ToDo有新消息', item)
			if(item.clientid) await todoUpdatePush(item)
		}
	}
}


