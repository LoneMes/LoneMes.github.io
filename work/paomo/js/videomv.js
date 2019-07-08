$(function(){
	var mv =_V_("videomv");
	
	$("#p2_pao1").click(function(){
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
				
				$(".p2_pao,#player,#playercontrol").fadeOut(500);
				$("#themv").css({"width":"0","margin-left":"0"}).animate({"width":"640px","margin-left":"-320px"},800);
				$("#mvclose").fadeIn(800);
				mv.play();
		});
		
	$("#mvclose").click(function(){
		mv.pause();
		$("#themv").animate({"width":"0","margin-left":"0"},800);
		$(".p2_pao,#player,#playercontrol").fadeIn(500);
		$("#mvclose").fadeOut();
		});
		
	$("#p2_pao3").toggle(
		function(){
				$("#page2_xinxi_info").animate({opacity:"show","left":"70%"},500);
			},
		function(){
				$("#page2_xinxi_info").animate({opacity:"hide","left":"60%"},500);
			}
	);
	
	$("#p2_pao4").toggle(
		function(){
				$("#page2_geci_info").animate({opacity:"show","left":"10%"},800);
			},
		function(){
				$("#page2_geci_info").animate({opacity:"hide","left":"30%"},800);
			}
		);
});
