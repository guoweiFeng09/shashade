'use strict'
module.exports = async (db, data) => {
	const dbData = await db.collection("table").where({key: 'update'}).get()
	const res = dbData.data && dbData.data[0] || {}
	console.log('version', JSON.stringify(res))
	return res
}
