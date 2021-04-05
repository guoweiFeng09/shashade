'use strict';
const todoUpdate = require('./api/todo.js')

exports.main = async (event, context) => {
	// todo 更新推送
	return todoUpdate()
}
