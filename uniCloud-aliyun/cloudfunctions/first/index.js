'use strict'

const dealRequest = require('./api/index.js')
exports.main = async (event, context) => {
	return dealRequest(event)
}
