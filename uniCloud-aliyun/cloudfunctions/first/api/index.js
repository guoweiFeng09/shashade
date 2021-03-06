'use strict'
const db = uniCloud.database()

const getVersion = require('./getVersion.js')
const getPassword = require('./getPassword.js')

module.exports = (event) => {
	const { url, data } = event
	switch(url) {
		case 'getVersion':
			return getVersion(db)
			break
		case 'getPassword':
			return getPassword(db)
			break
		
	}
}
