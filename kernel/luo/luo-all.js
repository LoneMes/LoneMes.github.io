/**
*	全局属性
*/



/*
*	全局loading 显示和隐藏
*/
function l_loadingIn(){
	$(".l_loading").fadeIn(300);
	}
	
function l_loadingOut(){
	$(".l_loading").fadeOut(300);
	}

/*
*局部loading 显示和隐藏
*/
function l_loadingMIn($obj){
		if(typeof $obj != "undefined"){
			$("<div class='l_curtain'><img class='l_loadingM' src='loading.jpg' alt='loading...'/></div>").appendTo($obj).fadeIn(300);
		}
	}

function l_loadingMOut($obj){
		if(typeof $obj != "undefined"){
			$obj.find(".l_curtain").fadeOut(300,function(){$(this).remove()});
		}
	}
	
/*
*	返回浏览器类型和版本 IE6-9返回false
*/
function l_checkBrowser(){
	"use strict"
	if(this === undefined){
		return true;
	}
	return false;
}

/**
 * localStorage保存数据
 * @param String key  保存数据的key值
 * @param String value  保存的数据
 */
function setLocVal(key,value){
	if(window.localStorage){
		window.localStorage[key] = value;
	}
	
}

/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
function getLocVal(key){
	var temp = null;
	if(window.localStorage){
		temp = window.localStorage[key];
	}
	if(temp)
		return temp;
	else
		return "";
}

/**
 * 清除缓存
 * @param Striong key  保存数据的key，如果不传清空所有缓存数据
 */
function clearLocVal(key){
	if(key)
		window.localStorage.removeItem(key);
	else
		window.localStorage.clear();
}

/**
*禁止所有的图片和连接的drag事件
*/
function nodrag(){
	$("img,a").attr("draggable","false");	
}

/**
*删除字符串两端的空格
*/
function trim(str){
　　     return str.replace(/(^\s*)|(\s*$)/g, "");
　　 }