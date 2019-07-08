$(function(){
			$("#xhinfo1").animate({top:"150px",opacity:"show"},200);
			$("#xhinfo2").delay(50).animate({top:"175px",opacity:"show"},200);
			$("#xhinfo3").delay(100).animate({top:"200px",opacity:"show"},200);
			$("#xhinfo4").delay(150).animate({top:"225px",opacity:"show"},200);
			$("#xhinfo5").delay(200).animate({top:"250px",opacity:"show"},200);
			$("#xhinfo6").delay(250).animate({top:"275px",opacity:"show"},200);
			$("#xhinfo7").delay(300).animate({top:"300px",opacity:"show"},200);
			$("#xhinfo8").delay(350).animate({top:"325px",opacity:"show"},200);
			$("#xhinfo9").delay(400).animate({top:"350px",opacity:"show"},200);
			$("#xhinfo10").delay(450).animate({top:"375px",opacity:"show"},200);
			$("#xhinfo11").delay(500).animate({top:"400px",opacity:"show"},200);
			$("#xhinfo12").delay(550).animate({top:"425px",opacity:"show"},200);
			
			$("#xh_button").click(function(){
				$("#xhinfo12").fadeOut("fast");
				$("#xhinfo11").delay(50).fadeOut("fast");
				$("#xhinfo10").delay(100).fadeOut("fast");
				$("#xhinfo9").delay(150).fadeOut("fast");
				$("#xhinfo8").delay(200).fadeOut("fast");
				$("#xhinfo7").delay(250).fadeOut("fast");
				$("#xhinfo6").delay(300).fadeOut("fast");
				$("#xhinfo5").delay(350).fadeOut("fast");
				$("#xhinfo4").delay(400).fadeOut("fast");
				$("#xhinfo3").delay(450).fadeOut("fast");
				$("#xhinfo2").delay(500).fadeOut("fast");
				$("#xhinfo1").delay(550).fadeOut("fast",next0);
				});
		});
		
	function next0(){
			$("#the1").animate({top:"0px",left:"130px"},200);
			$("#the2").delay(100).animate({top:"0px",left:"-300px"},200);
			$("#the3").delay(200).animate({top:"0px",left:"-50px"},200);
			$("#the4").delay(300).animate({top:"0px",left:"0px"},200);
			$("#the5").delay(400).animate({top:"0px",left:"-80px"},200);
			$("#the6").delay(500).animate({top:"0px",left:"300px"},200,next1);
		}
	function next1(){
			if($.browser.mozilla)
			{
				$("#box").css("-moz-animation-play-state","running");
			}
			else if($.browser.msie)
			{
				window.location.href="index.jsp";
			}
			else
			{
				$("#box").css("-webkit-animation-play-state","running");
			}
			$("#box").delay(1000).animate({"top":"0px"},next2);
		}
	function next2(){
		$("#the1").animate({width:"50px",height:"50px",top:"0px",left:"0px"},300);
		$("#the2").delay(100).animate({width:"50px",height:"50px",top:"0px",left:"0px"},300);
		$("#the3").delay(200).animate({width:"50px",height:"50px",top:"0px",left:"0px"},300);
		$("#the4").delay(300).animate({width:"50px",height:"50px",top:"0px",left:"0px"},300);
		$("#the5").delay(400).animate({width:"50px",height:"50px",top:"0px",left:"0px"},300);
		$("#the6").delay(500).animate({width:"50px",height:"50px",top:"0px",left:"0px"},300,next3);
	}
	function next3(){
		$("#boss").animate({marginLeft:"-220px"},2000,next4);
	
		if($.browser.mozilla)
		{
			$("#the1").css("-moz-transform","rotateX(0deg) rotateY(0deg) translateZ(25px)");
			$("#the2").css("-moz-transform","rotateX(90deg) rotateY(0deg) translateZ(25px)");
			$("#the3").css("-moz-transform","rotateX(270deg) rotateY(0deg) translateZ(25px)");
			$("#the4").css("-moz-transform","rotateX(0deg) rotateY(90deg) translateZ(25px)");
			$("#the5").css("-moz-transform","rotateX(0deg) rotateY(270deg) translateZ(25px)");
			$("#the6").css("-moz-transform","rotateX(0deg) rotateY(180deg) translateZ(25px)");
		}
		else
		{
			$("#the1").css("-webkit-transform","rotateX(0deg) rotateY(0deg) translateZ(25px)");
			$("#the2").css("-webkit-transform","rotateX(90deg) rotateY(0deg) translateZ(25px)");
			$("#the3").css("-webkit-transform","rotateX(270deg) rotateY(0deg) translateZ(25px)");
			$("#the4").css("-webkit-transform","rotateX(0deg) rotateY(90deg) translateZ(25px)");
			$("#the5").css("-webkit-transform","rotateX(0deg) rotateY(270deg) translateZ(25px)");
			$("#the6").css("-webkit-transform","rotateX(0deg) rotateY(180deg) translateZ(25px)");
		}
		
		}
	function next4(){
		$("#the1,#the2,#the3,#the4,#the5,#the6").css("backgroundImage","url(img/xh5050.png)");
		$("#xhz1").animate({left:"180px",opacity:"show"},1000);
		$("#xhz2").delay(200).animate({left:"210px",opacity:"show"},1500);
		$("#xhz3").delay(600).animate({left:"150px",opacity:"show"},1800);
		$("#xhz4").delay(300).animate({left:"120px",opacity:"show"},1400);
		$("#xhz5").delay(200).animate({left:"0px",opacity:"show"},1200);
		$("#xhz6").delay(600).animate({left:"90px",opacity:"show"},2000);
		$("#xhz7").delay(400).animate({left:"30px",opacity:"show"},1700);
		$("#xhz8").delay(800).animate({left:"60px",opacity:"show"},1900);
		$("#father").delay(2700).fadeOut(500,next5);
		}
	function next5(){
		window.location.href="index.html";
		
	}