// 格式化时间
function timeFormat(date, fmt) {
	var that = new Date(date);
	var o = {
		"M+": that.getMonth() + 1, //月份   
		"d+": that.getDate(), //日   
		"h+": that.getHours(), //小时   
		"m+": that.getMinutes(), //分   
		"s+": that.getSeconds(), //秒   
		"q+": Math.floor((that.getMonth() + 3) / 3), //季度   
		"S": that.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (that.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;

}

function getTimeNow() {
	return timeFormat(new Date().getTime() + 8 * 3600 * 1000, 'yyyy-MM-dd hh:mm:ss')
}

function genSessionId(){
	var length = 32
	var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
	if ( !"0"[0] ) { //fix IE67
		str = str.split("")
	}
	for(var i=0,id="",len = str.length;i < length;i++){
		id += str[Math.floor(Math.random() * len)]
	}
	return id
}
module.exports = {
	timeFormat,
	getTimeNow,
	genSessionId
}
