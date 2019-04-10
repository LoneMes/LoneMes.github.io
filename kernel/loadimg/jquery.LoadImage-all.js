/*
loadpic     加载中的图片路径
*/
jQuery.fn.LoadImage=function(animatechose){

	return this.each(function(){
		var t=$(this);
		var src=t.data("src");
		var img=new Image();

		//动画效果
		var animates = function(the,chose){
			if(!chose || chose==1){
				the.animate({"opacity":"1"},300);
			}
		}
		
		//加载完毕时触发
		img.onload = function(){
			img.onload = null;
			t.removeClass("load_img");
			t.css({"opacity":"0","background-image":"none"}).attr("src",img.src);
			animates(t,animatechose?animatechose:1);
			img = null;
			
		}
		
		//加载出错时触发
		img.onerror = function(){
			img = null;
			t.removeClass("load_img");
		}
		
		img.src=src;

		//如果图片已经加载成功 则直接返回
		if(img.complete){
			img.onload = null;
			t.removeClass("load_img");
			t.css({"opacity":"0","background-image":"none"}).attr("src",img.src);
			animates(t,animatechose?animatechose:1);
			img = null;
		    return;
		}
		
		t.css({"background-image":"url('kernel/index/img/onload.gif')","background-position":"center","background-repeat":"no-repeat"});
	});
}

