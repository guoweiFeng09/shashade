'use strict'
const db = uniCloud.database()

const getVersion = require('./getVersion.js')
const getPassword = require('./getPassword.js')
const todo = require('./todo.js')
const user = require('./user.js')

module.exports = (event) => {
	const { url, data } = event
	switch(url) {
		case 'getVersion':
			return getVersion(db)
			break
		case 'getPassword':
			return getPassword(db)
			break
		case 'addTodoItem':
		case 'removeTodoItem':
		case 'updateTodoItem':
		case 'getTodoList':
		case 'getTodoListDone':
		case 'getTodoItem':
		case 'updateTodoItemComplete':
			return todo(db, event)
			break
		case 'user/login':
		case 'user/checkSession':
			return user(db, event)
			break
		
	}
}
