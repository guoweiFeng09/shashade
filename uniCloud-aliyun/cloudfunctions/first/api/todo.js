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
			return add(db, data)
			break
		case 'removeTodoItem':
			return remove(db, data)
			break
		case 'updateTodoItem':
			return update(db, data)
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
			return updateTodoItemComplete(db, data)
			break
		
	}
}

async function add(db, data) {
	data = data || {}
	data.id = '' + parseInt(Math.random() * 10000) + new Date().getTime()
	data.done = 0
	const dbData = await db.collection(collection).add(data)
	const isSuceess = dbData.id
	const res = isSuceess ? successRes : failRes
	console.log('add', data, dbData)
	return res
}

async function remove(db, data) {
	const { id } = data
	const dbData = await db.collection(collection).where({id}).remove()
	const isSuceess = dbData.affectedDocs
	const res = isSuceess ? successRes : failRes
	console.log('remove', data, dbData, res)
	return res
}

async function update(db, data) {
	const { id } = data
	const dbData = await db.collection(collection).where({id}).update(data)
	const isSuceess = dbData.affectedDocs
	const res = isSuceess ? successRes : failRes
	console.log('update', data, dbData, res)
	return res
}

async function updateTodoItemComplete(db, data) {
	const { id } = data
	const dbData = await db.collection(collection).where({id}).update({
	  done: 1,
	  completeTime: util.timeFormat(new Date().getTime() + 8 * 3600 * 1000, 'yyyy-MM-dd hh:mm:ss')
	})
	const isSuceess = dbData.affectedDocs
	const res = isSuceess ? successRes : failRes
	console.log('update', data, dbData, res)
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
	
	console.log('get', res)
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
	
	console.log('get', res)
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
