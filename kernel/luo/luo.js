function l_loadingIn(){$(".l_loading").fadeIn(300);}
function l_loadingOut(){$(".l_loading").fadeOut(300);}
function l_loadingMIn($obj){if(typeof $obj != "undefined"){$("<div class='l_curtain'><img class='l_loadingM' src='loading.jpg' alt='loading...'/></div>").appendTo($obj).fadeIn(300);}}
function l_loadingMOut($obj){if(typeof $obj != "undefined"){$obj.find(".l_curtain").fadeOut(300,function(){$(this).remove()});}}
function l_checkBrowser(){
	"use strict"
	if(this === undefined){return true;}return false;}
function setLocVal(key,value){if(window.localStorage){window.localStorage[key] = value;}}
function getLocVal(key){var temp = null;if(window.localStorage){temp = window.localStorage[key];}if(temp)return temp;else return "";}
function clearLocVal(key){if(key)window.localStorage.removeItem(key);else window.localStorage.clear();}
function nodrag(){$("img,a").attr("draggable","false");	}
function trim(str){return str.replace(/(^\s*)|(\s*$)/g, "");}