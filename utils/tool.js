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
function DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式 
   var  aDate,  oDate1,  oDate2,  iDays 
   aDate  =  sDate1.split("-") 
   oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]) //转换为12-18-2006格式 
   aDate  =  sDate2.split("-") 
   oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]) 
   iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24) //把相差的毫秒数转换为天数 
   return  iDays 
}   
   
// 简单的 uni.showToast
function showToast(msg, duration = 1500) {
	if (uni.timer) clearTimeout(uni.timer)
	uni.showToasting = true
	uni.showToast({
		title: msg,
		icon: "none",
		duration
	})
	setTimeout(() => {
		uni.showToasting = false
	}, duration)
}

//防抖
function _debounce(fn, delay) {
	var delay = delay || 200;
	var timer;
	return function() {
		var th = this;
		var args = arguments;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			timer = null;
			fn.apply(th, args);
		}, delay);
	};
}
//节流
function _throttle(fn, interval) {
	var last;
	var timer;
	var interval = interval || 200;
	return function() {
		var th = this;
		var args = arguments;
		var now = +new Date();
		if (last && now - last < interval) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				last = now;
				fn.apply(th, args);
			}, interval);
		} else {
			last = now;
			fn.apply(th, args);
		}
	}
}



module.exports = {
	timeFormat,
	showToast,
	_debounce,
	_throttle,
	DateDiff
}
