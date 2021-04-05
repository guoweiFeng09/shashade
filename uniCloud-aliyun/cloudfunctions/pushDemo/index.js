'use strict';
const todoWarn = require('./api/todo.js')

exports.main = async (event, context) => {
	// todo 将到期推送
	return todoWarn()
}
