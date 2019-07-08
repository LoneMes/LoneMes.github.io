/* 主页效果JS */
/* 片头效果 */
window.onload = function(){
	$("#boss").fadeIn(1000);
	$("#login_a_b1").click(function(){	/* 片头按钮点击 */
		musicclose();
		movieplay();
		$("#centerbody").animate({top:"150%"},1000,next1);
		$("#navig,#curtain,#qiul1,#qiul2,#qiul3").delay(300).fadeOut(500);
		});
	}
function next1(){
	$("#show1").animate({top:"30%"},800);
	$("#show2").fadeIn(800);
	$("#show2_img").animate({width:"+=144",height:"+=66",marginTop:"-=33",marginLeft:"-=72"},4500);
	$("#show1_div1").delay(500).animate({left:"50%"},1000);
	$("#show1_div2").delay(700).animate({left:"50%"},1000);
	$("#show1_div3").delay(900).animate({left:"50%"},1000,next2);
	}
function next2(){
	$("#show1_div3").delay(800).animate({left:"5%",opacity:"hide"},1000);
	$("#show1_div2").delay(1000).animate({left:"5%",opacity:"hide"},1000);
	$("#show1_div1").delay(1200).animate({left:"5%",opacity:"hide"},1000,next3);
	$("#show1").delay(2000).animate({top:"100%"},800);
	}
function next3(){
	$("#show2").fadeOut(500);
	$("#show3").animate({left:"50%"},800);
	$("#show4").animate({top:"-100px"},2500);
	$("#show3_div1").delay(900).animate({left:"110px",opacity:"show"},600).animate({left:"-=40"},200);
	$("#show3_div2").delay(1000).animate({left:"130px",opacity:"show"},600).animate({left:"-=40"},200);
	$("#show3_div3").delay(1100).animate({left:"150px",opacity:"show"},600).animate({left:"-=40"},200);
	$("#show3_div4").delay(1200).animate({left:"170px",opacity:"show"},600).animate({left:"-=40"},200);
	$("#show3_div5").delay(1300).animate({left:"190px",opacity:"show"},600).animate({left:"-=40"},200,next4);
	}
function next4(){
	$("#show3").delay(800).animate({left:"100%"},800,next5);
	}
function next5(){
	$("#show4_div1").animate({top:"200px",opacity:"show"},500);
	$("#show4_div1_div1").delay(300).animate({width:"300px",left:"0%"},600,next6);
	}
function next6(){
	$("#zi1").animate({top:"8px"},200);
	$("#zi2").delay(100).animate({top:"8px"},200);
	$("#zi3").delay(200).animate({top:"8px"},200);
	$("#zi4").delay(300).animate({top:"8px"},200);
	$("#zi5").delay(400).animate({top:"8px"},200);
	$("#zi6").delay(500).animate({top:"8px"},200);
	$("#zi7").delay(600).animate({top:"8px"},200);
	$("#show4_img").animate({top:"-=20"},300).delay(800).animate({top:"-=25"},300).delay(800).animate({top:"-=25"},200,next7);
	}
function next7(){
	$("#boss").delay(500).fadeOut(800,next8);
	}
function next8(){
	window.location.href="index.html";
	}

/* 控制效果 */
$(function(){
	if($.browser.mozilla)
		{
			$(document).mousemove(function(e){						//3D	
				$("#qiul1").css({marginTop:-250-e.pageY/5,marginLeft:-400-e.pageX/5});
				$("#qiul2").css({marginTop:-250-e.pageY/12,marginLeft:-400-e.pageX/12});
				$("#qiul3").css({marginTop:-250-e.pageY/20,marginLeft:-400-e.pageX/20});
				$("#centerbody_temp").css("-moz-transform","rotateY("+(e.pageX-600)/10+"deg) rotateX("+(250-e.pageY)/10+"deg)");
			});
	}
	else if($.browser.msie)
	{
		$(document).mousemove(function(e){						//3D	
				$("#qiul1").css({marginTop:-250-e.pageY/5,marginLeft:-400-e.pageX/5});
				$("#qiul2").css({marginTop:-250-e.pageY/12,marginLeft:-400-e.pageX/12});
				$("#qiul3").css({marginTop:-250-e.pageY/20,marginLeft:-400-e.pageX/20});
			});
	}
	else
	{
		$(document).mousemove(function(e){						//3D	
				$("#qiul1").css({marginTop:-250-e.pageY/5,marginLeft:-400-e.pageX/5});
				$("#qiul2").css({marginTop:-250-e.pageY/12,marginLeft:-400-e.pageX/12});
				$("#qiul3").css({marginTop:-250-e.pageY/20,marginLeft:-400-e.pageX/20});
				$("#centerbody_temp").css("-webkit-transform","rotateY("+(e.pageX-600)/10+"deg) rotateX("+(250-e.pageY)/10+"deg)");
			});
	}
	
			
	$("#centerbody_login").click(function(){				//点击 员工登录
		$(".cb").fadeOut(300);
		$("#login").fadeIn(300);
		});
		
	$("#login_return").click(function(){					//点击 登录框中的返回
		$(".cb").fadeIn(300);
		$("#login").fadeOut(300);
		});
		
	/* 点击 3D酒店环境 */
	$("#hotelcondition").click(function(){
		$("#curtain2_roll").css({height:"0px",top:"150px"});
		$("#curtain2_explain").css({width:"0px",left:"250px"});
		$("#curtain2_explain_img").css("display","none");
		$("#content_img").attr("src","img/write.png");
		
		$("#navig,#curtain,#qiul1,#qiul2,#qiul3").fadeOut(500);
		$("#curtain2,#navig_hotel").fadeIn(800);
		$("#centerbody").animate({top:"150%"},800);
		$("#curtain2_roll").delay(800).animate({height:"300px",top:"0px"},500);
		});
		
		
	/* 点击 首页*/
	$("#hotel_home").click(function(){
		$("#centerbody").animate({top:"50%"},800);
		$("#navig,#curtain,#qiul1,#qiul2,#qiul3").fadeIn(800);
		$("#navig_hotel,#curtain2,#curtain3,#curtain4").fadeOut(500);
		});
		
	/* 点击 联系方式*/
	$("#hotel_cul").click(function(){
		if($("#curtain3").css("display") =="none")
		{
			$("#themap").css({width:"1015px",height:"348px",marginLeft:"-=46",display:"none"});
			$("#addr").css({display:"none",marginTop:"+=100"});
			$("#theaddrzi").css({display:"none",left:"210px"});
			
			$("#navig,#curtain2,#curtain4").fadeOut(500);
			$("#curtain3").fadeIn(800);
			$("#themap").delay(700).animate({width:"-=92",height:"-=31",marginLeft:"+=46",opacity:"show"},500);
			$("#addr").delay(1000).animate({opacity:"show",marginTop:"-=100"},500);
			$("#theaddrzi").delay(1400).animate({opacity:"show",left:"310px"},800);
		}
		});
	
	/* 点击 ABOUT US*/
	$("#hotel_us").click(function(){
		if($("#curtain4").css("display") == "none")
		{
			$("#cur4_center").css({height:"0px",marginTop:"0px"});
			$("#navig,#curtain2,#curtain3").fadeOut(500);
			$("#curtain4").fadeIn(800);
			$("#cur4_center").delay(800).animate({height:"300px",marginTop:"-150px"},500);
		}
		});
		
	/* 点击 导航酒店环境*/
	$("#hotel_con").click(function(){
		if($("#curtain2").css("display") == "none")
		{
			$("#curtain2_explain").css({width:"0px",left:"250px"})
			$("#curtain2_roll").css({height:"0px",top:"150px"});
			$("#content_img").attr("src","img/write.png");
			$("#curtain2_explain_img").css("display","none");
			
			$("#navig,#curtain3,#curtain4").fadeOut(500);
			$("#curtain2").fadeIn(800);
			$("#curtain2_roll").delay(800).animate({height:"300px",top:"0px"},500);
		}
		});
	
	/* ABOUT US页移动 */
	$("#cur4_p1").click(function(){
		$("#level4").stop().animate({top:"0px",marginLeft:"-200px"},2000);/* 0,-150 */
		$("#level3").stop().animate({top:"-60px",marginLeft:"-860px"},2000);
		$("#level2").stop().animate({top:"-120px",marginLeft:"-1020px"},2000);
		$("#level1").stop().animate({top:"-180px",marginLeft:"-680px"},2000);
		});
	$("#cur4_p2").click(function(){
		$("#level4").stop().animate({top:"0px",marginLeft:"-1800px"},2000);
		$("#level3").stop().animate({top:"-60px",marginLeft:"-2140px"},2000);
		$("#level2").stop().animate({top:"-120px",marginLeft:"-1980px"},2000);
		$("#level1").stop().animate({top:"-180px",marginLeft:"-1320px"},2000);
		});
	$("#cur4_p3").click(function(){
		$("#level4,#level1").stop().animate({top:"-300px",marginLeft:"-1000px"},2000);
		$("#level3,#level2").stop().animate({top:"-300px",marginLeft:"-1500px"},2000);
		});
	$("#cur4_p4").click(function(){
		$("#level4").stop().animate({top:"-600px",marginLeft:"-200px"},2000);
		$("#level3").stop().animate({top:"-540px",marginLeft:"-860px"},2000);
		$("#level2").stop().animate({top:"-480px",marginLeft:"-1020px"},2000);
		$("#level1").stop().animate({top:"-420px",marginLeft:"-680px"},2000);
		});
	$("#cur4_p5").click(function(){
		$("#level4").stop().animate({top:"-600px",marginLeft:"-1800px"},2000);
		$("#level3").stop().animate({top:"-540px",marginLeft:"-2140px"},2000);
		$("#level2").stop().animate({top:"-480px",marginLeft:"-1980px"},2000);
		$("#level1").stop().animate({top:"-420px",marginLeft:"-1320px"},2000);
		});
		
	$("#curtain2_up").click(function(){	/* 酒店环境向上按钮 */
		
		if(parseInt($("#roll_high").css("top"))<50)
		{
			$("#roll_high").animate({top:"+=100"},300);
		}
		});
	$("#curtain2_down").click(function(){	/* 酒店环境向下按钮 */
		if(parseInt($("#roll_high").css("top"))>-300)
		{
			$("#roll_high").animate({top:"-=100"},300);
		}
		});
	$(".roll_high_div").click(function(){	/* 酒店环境滚动小图点击 */
		$("#content_img").attr("src","img/"+$(this).attr("name")+".jpg");
		$("#curtain2_explain").css({width:"0px",left:"250px"}).animate({width:"200px",left:"150px"},400);
		$("#curtain2_explain_img").css("display","none").text($(this).text()).delay(400).fadeIn(200);
		
		});
	$("#content_img").mouseenter(function(){	/* 酒店环境大图鼠标进入 */
		$(this).animate({width:"+=25",height:"+=15",marginLeft:"-=13",marginTop:"-=8"},300);
		});
	$("#content_img").mouseleave(function(){	/* 酒店环境大图鼠标离开 */
		$(this).animate({width:"-=25",height:"-=15",marginLeft:"+=13",marginTop:"+=8"},300);
		});
	$(".roll_high_div").mouseenter(function(){
		$(this).fadeTo(300,0.5);
		});
	$(".roll_high_div").mouseleave(function(){
		$(this).fadeTo(300,1);
		});
	$("#musicimg").toggle(function(){
		musicclose();
		$("#musicimg>img").attr("src","img/music2.gif");
		},function(){
			musicplay();
			$("#musicimg>img").attr("src","img/music.gif");
			
			});
});








function musicclose(){
	if($.browser.msie){
			$("#musice").get(0).stop();
		}else{
			$("#musica").get(0).pause();
			}
	}
function musicplay(){
	if($.browser.msie){
			$("#musice").get(0).play();
		}else{
			$("#musica").get(0).play();
			}
	}
function movieplay(){
	if($.browser.msie){
			$("#moviee").get(0).play();
		}else{
			$("#moviea").get(0).play();
			}
	}