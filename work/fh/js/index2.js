/* 主页AJAX JS*/
$(function(){
	$("#login_form").submit(function(){
		var tempu = $("#testtext").val();
		var tempp = $("#login_password").val();
			if(tempu!=null && tempu!="")
			{
				if(tempp!=null && tempp!="")
				{
					$("#login_info").css("color","#EEE").text("登录中...");
					$.post("test/login_login", $("#login_form").serialize(),function(data){						
						if(data == "1"){
							/*前台操作员登录成功*/
							window.location.href="function/hhq/myfeihong/hhq.jsp";
							}
						else if(data == "3"){
							/*经理登录成功*/
							window.location.href="test/managerin";
							}
						else if(data == "10"){
							/*系统管理员登录成功*/
							window.location.href="function/yt/admin/index.jsp";
						}
						else{
							$("#login_info").css("color","#D00").text("工号或密码错误！");
						}
					});
				}
				else
				{
					$("#login_info").css("color","#D00").text("密码不能为空！");
				}
			}
			else
			{
				$("#login_info").css("color","#D00").text("工号不能为空！");	
			}
			return false;
	});
		
	$("#login_password").blur(function(){
			if($(this).val()==null || $(this).val()=="")
			{
					$("#login_info").css("color","#D00").text("密码不能为空！");
			}
		});
	$("#testtext").blur(function(){
			if($(this).val()==null || $(this).val()=="")
			{
					$("#login_info").css("color","#D00").text("工号不能为空！");
			}
		});
})