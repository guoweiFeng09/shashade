'use strict'
const util = require('../utils/tool.js')
// 表名称
const collection = 'user'
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
		case 'user/login':
			return login(db, data)
			break
		case 'user/checkSession':
			return checkSession(db, event)
			break
		case 'getUserItem':
			return getById(db, data)
			break
		
	}
}

async function login(db, data) {
	const { mobile, password, clientid } = data
	const dbData = await db.collection(collection).where({mobile}).get()
	const isSuceess = dbData.data
	let res
	
	if(isSuceess
		&& isSuceess[0] 
		&& mobile == isSuceess[0].mobile 
		&& password == isSuceess[0].password
	) {
		const sessionId = util.genSessionId()
		const updateTime = util.getTimeNow()
		await db.collection(collection).where({mobile}).update({
		  sessionId,
		  updateTime
		})
		await db.collection('group').where({mobile}).update({
		  clientid,
		  updateTime
		})
		successRes.data = {
			sessionId
		}
		res = successRes
	}else {
		res = failRes
	}
	return res
}


async function checkSession(db, data) {
	const { sessionId } = data
	const dbData = await db.collection(collection).where({sessionId}).get()
	const isSuceess = dbData.data
	let res
	if(isSuceess 
		&& isSuceess[0] 
		&& sessionId == isSuceess[0].sessionId
	) {
		res = successRes
	}else {
		res = failRes
	}
	return res
}

// async function add(db, data) {
// 	data = data || {}
// 	data.id = '' + parseInt(Math.random() * 10000) + new Date().getTime()
// 	data.done = 0
// 	const dbData = await db.collection(collection).add(data)
// 	const isSuceess = dbData.id
// 	const res = isSuceess ? successRes : failRes
// 	console.log('add', data, dbData)
// 	todoUpdatePush() //更新推送
// 	return res
// }

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


