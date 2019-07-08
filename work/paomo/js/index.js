var canaudio = false;										//浏览器是否支持audio
var musicplaying = 1;										//是否正在播放音乐 0否，1是
var wordtime = new Date();									//记录上一次留言提交的时间，防止用户多次快速留言
var pagenum = 0;											//记录留言板的当前页x每页的条数
var ajaxing = 0;											//加载留言板时防止重复加载
var havemore=1;												//还有更多留言
$(function(){
	var wherenow = 0;										//当前所在页面
	var $body = $("#body");									//页面主体div
	var lastRunTime = new Date();							//防止滚轮事件重复触发

	if(!!document.createElement('audio').canPlayType)
	{
			canaudio = true;
	}
	else
	{
			canaudio = false;	
	}
	
	$("#nav_1").click(function(){
		if(wherenow!=0)
		{
			wherenow = 0;
			goPage0();
		}
		});
	$("#nav_2").click(function(){
		if(wherenow!=1)
		{
			wherenow = 1;
			goPage1();
		}
		});
	$("#nav_3").click(function(e){
		if(wherenow!=2)
		{
			wherenow = 2;
			goPage2(e);
		}
		});
	$("#nav_4").click(function(){
		if(wherenow!=3)
		{
			wherenow = 3;
			goPage3();
		}
		});
	$("#nav_5").click(function(){
		if(wherenow!=4)
		{
			wherenow = 4;
			goPage4();
		}
		});
		
	$(".nav_all").mouseenter(function(){
		var info = "";
		var thisid=$(this).attr("id");
		if(thisid=="nav_1")info="首页";
		else if(thisid=="nav_2")info="泡沫";
		else if(thisid=="nav_3")info="G.E.M";
		else if(thisid=="nav_4")info="留言";
		else info="联系";
		$("#nav_paomo").text(info).css("display","block").stop().animate({top:$(this).position().top-13},200);
		});
	$("#navigation").mouseleave(function(){
		$("#nav_paomo").fadeOut(300);
		});
	
	$("#page3").mousemove(function(e){
		$("#page2back").css({marginBottom:e.pageY/50,marginLeft:-e.pageX/50});
		});
		
	$body.bind('mousewheel',function(e, delta){  
            if(new Date()-lastRunTime>1000)
			{
				lastRunTime = new Date();
				if(delta>0 && wherenow>0)
				{
					wherenow--;
				}
				else if(delta<0 && wherenow<4)
				{
					wherenow++;
				}
				if(wherenow==0)goPage0();
				else if(wherenow==1)goPage1();
				else if(wherenow==2)goPage2(e);
				else if(wherenow==3)goPage3();
				else if(wherenow==4)goPage4();
			}
            return false;  
        });  
	
	$("#playercontrol").mouseover(function(){
		if(!musicplaying == 1)
		{
			$("#playercontrolview").css("background-image","url(img/cdstoping.png)").fadeIn(500);
		}
		else{
			$("#playercontrolview").css("background-image","url(img/cdplaying.png)").fadeIn(500);
		}
	}).mouseout(function(){
		$("#playercontrolview").fadeOut(300);
		}).click(function(){
			if(musicplaying == 1)
			{
					musicplaying = 0;
				if(canaudio)
				{
					$(".backmusic").get(0).pause();
				}
				else
				{
					$(".backmusic").get(1).pause();
				}
				$("#playercontrolview").css("background-image","url(img/cdstoping.png)");
				stopCD();
			}
			else
			{
				musicplaying = 1;
			if(canaudio)
				{
					$(".backmusic").get(0).play();
				}
				else
				{
					$(".backmusic").get(1).play();
				}
				startCD();
				$("#playercontrolview").css("background-image","url(img/cdplaying.png)");
			}
			});
		
	$("#facestyle").mouseover(function(){
			$("#faceimg").attr("src","img/style2.png");
			$(this).css({"text-shadow":"0 0 5px #FFF","color":"#F60"});
		}).mouseout(function(){
			$(this).css({"text-shadow":"0 0 0 #FFF","color":"#000"});
			$("#faceimg").attr("src","img/style1.png");
		}).click(function(){
				if($("#faceimgs").css("display")=="none"){
					$("#faceimgs").fadeIn("fast");
					}
				else{
					$("#faceimgs").fadeOut("fast");
					}
				}
			).change(function(){alert("123")});
	$("#saybood_words").click(function(){
			$("#faceimgs").fadeOut("fast");
		});
	$(".fc").live("click",function(){
		$("#saybood_words").html($("#saybood_words").html()+"<img src='"+$(this).attr("src")+"'>");
		$("#faceimgs").fadeOut("fast");
		});
		
	$("#myhead").one("click",page5_zishow);
	
	$(".spancolor").mouseover(function(){
			$(this).css("color","rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+")");
		}).mouseout(function(){
			$(this).css("color","rgb(33,33,33)");
			});
	
	$("#wordsform").submit(function(){
		if(wordFormCheck()){
			$.ajax({
				url:"words/save.do",
				type:"post",
				data:$('#wordsform').serialize(),
				success:function(msg){
					showInfo("留言成功");
					var tempdate = new Date();
					var month = tempdate.getMonth()+1;
					month = month<10?"0"+month:month;
					var day = tempdate.getDate();
					day = day<10?"0"+day:day;
					$("#allsays").mCustomScrollbar("scrollTo","top");
					$("<div class='w_box'><div class='w_name'>"+$("#username").val()+"</div><div class='w_words'>"+$("#hiddenWords").val()+"</div><div class='w_date'>"+tempdate.getFullYear()+"-"+month+"-"+day+"</div></div>").prependTo($("#trueallsays"));
					
				}
			});
		}
		return false;
	});
	
	loadMore();
});
	
window.onload = function(){
	$("#loading").fadeOut(500);
	$("#boss").fadeIn(1000,titleShow1());
	if(!!document.createElement('audio').canPlayType)
	{
			$(".backmusic").get(0).play();
	}
	else
	{
			$(".backmusic").get(1).play();
	}
	$("#introduction").mCustomScrollbar({scrollInertia:800,autoDraggerLength:false});
	$("#allsays").mCustomScrollbar({
		scrollInertia:500,
		autoDraggerLength:true,
		callbacks:{
			onTotalScroll:function(){loadMore()}
		}
	});
	
}
	
function titleShow1()
{
	$("#title_m").delay(300).fadeIn(1500);
	$("#title_p").delay(1000).fadeIn(1500,titleShow2());
}
function titleShow2()
{
	$("#word1").fadeIn(2000);
	$("#word2").delay(300).fadeIn(2000);
	$("#word3").delay(800).fadeIn(2000);
	$("#word4").delay(200).fadeIn(2000);
	$("#word5").delay(700).fadeIn(2000);
	$("#word6").delay(1300).fadeIn(2000);
	$("#word7").delay(1000).fadeIn(2000);
	$("#word8").delay(1500).fadeIn(2000);
	$("#word9").delay(2000).fadeIn(2000);
	$("#word10").delay(2500).fadeIn(2000);
	$("#word11").delay(3000).fadeIn(2000);
}
function goPage0(){
	startPaoPao();
	$(".nav_all").css("background-image","url('img/daohang1.png')");
	$("#nav_1").css("background-image","url('img/daohang2.png')");
	$("#body").animate({top:"0"},{easing:'swing',duration:1000});
	$(".nav_all").css("color","#ddd");
	}
function goPage1(){
	$(".nav_all").css("background-image","url('img/daohang1.png')");
	$("#nav_2").css("background-image","url('img/daohang2.png')");
	$(".p2_pao").css({"margin-left":"-30px","margin-top":"-30px","display":"none"});
	$("#body").animate({top:"-100%"},{easing:'swing',duration:1000,complete:stopPaoPao});
	$("#p2_left").css("top","-100%").delay(800).animate({top:0},1000);
	$("#p2_right").css("top","100%").delay(800).animate({top:0},1000,goPage1_2);
	$(".nav_all").css("color","#333");
	}
function goPage2(e){
	$(".nav_all").css("background-image","url('img/daohang1.png')");
	$("#nav_3").css("background-image","url('img/daohang2.png')");
	$("#headphoto,.intr_link").css("display","none");
	$("#introduction").css({display:"none",left:0})
	$("#page2back").css({marginBottom:e.pageY/50,marginLeft:-e.pageX/50});
	$(".nav_all").css("color","#ddd");
	$("#body").animate({top:"-200%"},{easing:'swing',duration:1000,complete:goPage2_2});
	}
function goPage3(){
	$(".nav_all").css("background-image","url('img/daohang1.png')");
	$("#nav_4").css("background-image","url('img/daohang2.png')");
	$("#body").animate({top:"-300%"},{easing:'swing',duration:1000,complete:stopPaoPao});
	$("#saybood").css("margin-top","0").animate({"margin-top":"-250px"},2000);
	$(".nav_all").css("color","#333");
	}
function goPage4(){
	$(".nav_all").css("background-image","url('img/daohang1.png')");
	$("#nav_5").css("background-image","url('img/daohang2.png')");
	$("#body").animate({top:"-400%"},{easing:'swing',duration:1000,complete:stopPaoPao});
	$(".nav_all").css("color","#ddd");
	}
function stopPaoPao(){
	$(".paopao").css({"animation-play-state":"paused","-webkit-animation-play-state":"paused"});
	}
function startPaoPao(){
	$(".paopao").css({"animation-play-state":"running","-webkit-animation-play-state":"running"});
	}
function stopCD(){
	$("#player").css({"animation-play-state":"paused","-webkit-animation-play-state":"paused"});
}
function startCD(){
	$("#player").css({"animation-play-state":"running","-webkit-animation-play-state":"running"});
	}
function goPage1_2(){
	$("#p2_pao3").stop().animate({marginTop:"108px",marginLeft:"85px",opacity:"show"},200);
	$("#p2_pao2").stop().delay(100).animate({marginTop:"-90px",marginLeft:"150px",opacity:"show"},200);
	$("#p2_pao1").stop().delay(200).animate({marginTop:"-210px",opacity:"show"},200);
	$("#p2_pao5").stop().delay(300).animate({marginTop:"-90px",marginLeft:"-210px",opacity:"show"},200);
	$("#p2_pao4").stop().delay(400).animate({marginTop:"108px",marginLeft:"-146px",opacity:"show"},200);
	}
function goPage2_2(){
	stopPaoPao();
	$("#headphoto").stop().fadeIn(1200);
	$("#introduction").stop().animate({opacity:"show",left:"20%"},1300,goPage2_3);
	}
function goPage2_3(){
		$("#link3").stop().css({top:"100px"}).animate({top:"-10px",opacity:"show"},500).animate({top:0},300);
		$("#link2").stop().css({top:"100px"}).delay(300).animate({opacity:"show",top:"-10px"},500).animate({top:0},300);
		$("#link1").stop().css({top:"100px"}).delay(700).animate({opacity:"show",top:"-10px"},500).animate({top:0},300);
	}
function page5_zishow(){
			$(".page5_zi").css("display","none");
			$("#zibox2").css("left",0);
			
			$("#zibox").css("display","block");
			$("#zi1").fadeIn(2000);
			$("#zi2").delay(2000).fadeIn(3000);
			$("#zi3").delay(4000).fadeIn(3000);
			$("#zi4").delay(6000).fadeIn(3000);
			$("#zi5").delay(8000).fadeIn(3000);
			$("#zi6").delay(10000).fadeIn(3000);
			$("#zibox2").delay(12000).animate({"left":"100px","opacity":"show"},2000,function(){
					$("#myhead").one("click",function(){
							$("#zibox").fadeOut(1000);
							$("#zibox2").fadeOut(1000,function(){
									$("#myhead").one("click",page5_zishow);
								});
						});
				});
	}

function wordFormCheck(){
	if($.trim($("#username").val()).length<=0){
		$("#username").val("游客");
	}

	var wordstext = $.trim($("#saybood_words").html());
	if(wordstext.length<=0){
		showInfo("啥都没写");
		return false;
		}
	else if(wordstext.length>254)
		{
			showInfo("写太多了");
			return false;
		}
	else
		{
		$("#hiddenWords").val(wordstext);
		}
	var nowdate = new Date();
	if(nowdate-wordtime<10000)
		{
			showInfo("发言太快");
			return false;
		}
	else
		{
			wordtime = nowdate;
		}
	return true;
}


function showInfo(txt)
{
	$("#getInfo").stop().fadeOut().text(txt).fadeIn(200).delay(2000).fadeOut(200);
}

function loadMore()
{
	if(havemore==1 && ajaxing==0)
		{
		ajaxing==1
		$.ajax({
			url:"words/find.do",
			data:"pagenum="+pagenum,
			dataType:"json",
			success:function(msg){
				if(msg.length>0)
					{
					for(var i=0;i<msg.length;i++)
						{
						$("<div class='w_box'><div class='w_name'>"+msg[i].username+"</div><div class='w_words'>"+msg[i].words+"</div><div class='w_date'>"+msg[i].date+"</div></div>").appendTo($("#trueallsays"));
						}
					}
				else
					{
						havemore=0;
					}
				pagenum+=8;
				ajaxing = 0;
				$("#allsays").mCustomScrollbar("update");
			}
		});
	}
}
