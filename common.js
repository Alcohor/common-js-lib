//@author Alcohor 于宸镔 <1013674928@qq.com> 2018-07-25




//创建随机颜色 rgb（x，x，x）
function randomColor() {
	var R = randomInt(0, 255);
	var G = randomInt(0, 255);
	var B = randomInt(0, 255);
	var color_val = "rgb(" + R + "," + G + "," + B + ")";
	return color_val;
}

//生成从a~b的随机整数
function randomInt(a, b) {
	min = a < b ? a : b;
	return Math.floor(Math.random() * Math.abs(a - b) + min);
}
//生成长度为amount，从0~max大小的数组。
function randomArr(amount, max) {
	var arr = [];
	for (var i = 0; i < amount; i++) {
		arr.push(parseInt(Math.random() * max));
	}
	return arr;
}
//获取（计算后的【表现出的】）元素的样式
function getEleStyle(ele) {
	if (ele.currentStyle) { //非IE
		return ele.currentStyle
	} else { //IE
		return getComputedStyle(ele);
	}
}

//过滤文本节点
function nodeFilter(nodelist) {
	var len = nodelist.length; //取出传入的数组的长度
	var temp = [] //创建容器
	for (var i = 0; i < len; i++) {
		if (nodelist[i].nodeType == 1) {
			temp.push(nodelist[i])
		}
	}
	return temp;
}

//解决IE没有getElementByClassName()函数的方法
(function () {
	if (document.getElementsByClassName) {
		return;
	} else {

		document.getElementsByClassName = function (className) {

			var allElements = document.getElementsByTagName("*");
			var resultArray = [];

			for (var i = 0, j = 0; i < allElements.length; i++) {
				if (allElements[i].className == className) {
					resultArray[j] = allElements[i];
					j++;
				}
			}

			return resultArray;
		}
	}

});

//计算一个dom元素的PageX/Y
function getPagePosition(target) {
	var sumLeft = target.offsetLeft;
	var sumTop = target.offsetTop;
	while (target.offsetParent != null) {
		sumLeft += target.offsetParent.offsetLeft;
		sumTop += target.offsetParent.offsetTop;
		target = target.offsetParent;
	}
	return {
		pageX: sumLeft,
		pageY: sumTop
	};
}


//封装 事件监听的添加函数
function addEventHandler(ele, eventType, fn, isCapture) {
	if (ele.addEventListener) {
		ele.addEventListener(eventTyle, fn, isCapture);
	} else {
		attachEvent("on" + eventType, fn);
	}
}

//@author Alcohor 于宸镔 <1013674928@qq.com> 2018-08-21
//封装拖拽函数
function draggable(ele, limtEle) {
	ele.style.position = "absolute"; //将需要拖拽的元素的定位方式设置为绝对定位

	ele.onmousedown = function (e) { //设置拖拽元素的鼠标按下事件
		var e = e || event;
		var curPos = { //获取点击时鼠标位置
			x: e.offsetX,
			y: e.offsetY
		}
		document.onmousemove = function (e) {
			var e = e || event;
			ele.style.margin = 0;
			if (limtEle != null) { //如果有限制父元素参数
				if (!limtEle.style.position) { //如果父元素没有定位方式
					limtEle.style.position = "relative"; //设置父元素定位方式为相对定位
				}
				var _left = (e.clientX - limtEle.offsetLeft) - curPos.x;
				var _top = (e.clientY - limtEle.offsetTop) - curPos.y;
				var _maxval_X = limtEle.offsetWidth - ele.offsetWidth;
				var _maxval_Y = limtEle.offsetHeight - ele.offsetHeight;

				ele.style.left = Math.max(0, Math.min(_maxval_X, _left)) + "px";
				ele.style.top = Math.max(0, Math.min(_maxval_Y, _top)) + "px";

			} else {
				var _left = e.clientX - curPos.x;
				var _top = e.clientY - curPos.y;

				ele.style.left = Math.max(0, Math.min(window.innerWidth - ele.offsetWidth, _left)) + "px";
				ele.style.top = Math.max(0, Math.min(window.innerHeight - ele.offsetHeight, _top)) + "px";
			}
		}
		document.onmouseup = function () {
			document.onmousemove = null;
		}
	}
}

//@author Alcohor 于宸镔 <1013674928@qq.com> 2018-08-22
//—————————————————cookie操作————————————————————————————
//获取Cookie的值
function getCookie(key) {
	var str = document.cookie;
	var list = str.split("; ")
	for (var i in list) {
		var res = list[i].split("=");
		if (res[0] == key) {
			return res[1];
		}
	}
	return;
}


function setCookie(key, value, expires, path) {
	var i = arguments.length; //获取参数数量
	switch (i) {
		case 0:
		case 1:
			return new Error("参数传递错误，请校验参数数量");
		case 2:
			{
				document.cookie = key + "=" + value + ";"
			}
		case 3:
			{
				var parm = arguments[2];
				if (typeof (parm) == Number) {
					var date = new Date;
					date.setSeconds(date.getSeconds() + parm)
					document.cookie = key + "=" + value + ";expires=" + date;
				} else {
					document.cookie = key + "=" + value + ";path=" + parm;
				}
			}
			break;
		case 4:
			{
				var date = new Date;
				date.setSeconds(date.getSeconds() + expires)
				document.cookie = key + "=" + value + ";expires=" + date + ";path=" + path
			}
			break;
	}

}
//@author Alcohor 于宸镔 <1013674928@qq.com> 2018-08-26
//—————————————————动画————————————————————————————
//滑动动画及色彩渐变 
function attributeMove(ele, attr, target, time) {
	clearInterval(ele.timer)
	var reg = /color/i
	if (!(attr.match(reg))) {
		var curStyle = parseInt(getEleStyle(ele)[attr]);
		var step = 16.6 * (target - curStyle) / time
		ele.timer = setInterval(function () {
			curStyle += step;
			ele.style[attr] = curStyle;
			console.log(curStyle - target);
			if (Math.abs(curStyle - target) <= step) {
				clearInterval(ele.timer);
				ele[attr] = target + "px"
			}
		}, 16.6)
	} else {
		curStyle = getEleStyle(ele)[attr];
		console.log(curStyle)
		var curColor = getColorRgba(curStyle);
		var tarColor = getColorRgba(target);
		var rStep = 16.6 * (tarColor.R - curColor.R) / time
		var gStep = 16.6 * (tarColor.G - curColor.G) / time
		var bStep = 16.6 * (tarColor.B - curColor.B) / time
		console.log(rStep)
		if (!(tarColor.Alph == curColor.Alph)) {
			var aStep = 16.6 * (tarColor.Alph - curColor.Alph) / time
		} else aStep = 0
		var r=curColor.R;
		var g=curColor.G;
		var b=curColor.B;
		var a=curColor.Alph;
		console.log(r,g,b)
		ele.timer = setInterval(function () {
			r += rStep;
			g += gStep;
			b += bStep;
			a += aStep;
			if((Math.abs(tarColor.R-r))<1&&(Math.abs(tarColor.G-g))<1&&(Math.abs(tarColor.B-b))<1&&(Math.abs(tarColor.Alph-a))*10<1){
				clearInterval(ele.timer);
				ele.style[attr] = target;
			}
			
			ele.style[attr] = "rgba(" + r + "," + g + "," + b + "," + a + ")";			
		}, 16.6)
	}
}

//@author Alcohor 于宸镔 <1013674928@qq.com> 2018-08-26
//—————————————————字符串处理————————————————————————————
//分离输入的色彩RGBA值
//Example：>>rgba(128,52,64)>>{R:128,G:52,B:64,Alph:?}
function getColorRgba(ColorStr) {
		var colorArr = ColorStr.split(",");
		colorArr[0] = colorArr[0].toString().split("(")[1];
		colorArr[colorArr.length - 1] = parseInt(colorArr[colorArr.length - 1]);
		for (var i in colorArr) {
			colorArr[i] = parseInt(colorArr[i])
		}
		var r = colorArr[0];
		var g = colorArr[1];
		var b = colorArr[2];
		if (colorArr.length == 4) {
			var a = colorArr[3]
		}
		return {
			R: r,
			G: g,
			B: b,
			Alph: a != null ? a : 1
		}
	}
	
	
//@author Alcohor 于宸镔 <1013674928@qq.com> 2018-09-06
//函数防抖，method：需要防抖的函数；delay延迟时间；context 执行环境 （指定this）。
function debounce(method,delay,context){
	clearTimeout(method.tId)//清除之前的定时器
	method.tId = setTimeout(function(){//延时500毫秒触发
			method.call(context);
		},delay)
}
	
//@author Alcohor 于宸镔 <1013674928@qq.com> 2018-09-06
//函数节流，method：需要节流的函数；delay延迟(间隔最小)时间。
function throttle(method,delay,context){
	var lastTime = 0
	return function(){
		var now = new Data().getTime()
		if(now-lastTime>delay){
			method.call(context);
			lastTime = new Date.getTime()
		}
	}
}