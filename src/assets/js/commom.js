function formater(val){
	let day = 24 * 60 * 60,
		hour = 60 * 60,
		minute = 60,
		time = '',
		leftTime = 0; // 用来计算剩余时间
	if(val > 0){
		if(val > day){
			time += parseInt(val / day) + '天'
			val -= parseInt(val / day) * day
		}
		if(val > hour){
			time += parseInt(val / hour) + '小时'
			val -= parseInt(val / hour) * hour
		}
		if(val > minute) {
			time += parseInt(val / minute) + '分钟'
		}
		return time;
	} else {
		return false
	}
}

export {formater}