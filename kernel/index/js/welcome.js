//全局变量
var h = 0; //记录可用工作区的高宽
var w = 0;
var l = null; //左边遮罩
var r = null; //右边遮罩

//页面内容加载完毕时执行
window.onload = function() {
  //禁止img和a的drog事件
  nodrag();

  //如果浏览器>IE9,继续进行页面动画
  if (!ltie9()) {
    pageInit();
    loadout();
  }
};

/**
	如果浏览器为IE6-8，弹出提示框
	ie6-8 返回true
*/
function ltie9() {
  if (!l_checkBrowser()) {
    $(".l_curtain").fadeIn(0);
    $("#checkrower")
      .css("top", "50%")
      .animate({ top: "30%", opacity: "show" }, 300);
    return true;
  } else {
    return false;
  }
}

/**
	首次进入页面时的初始化
*/
function pageInit() {
  //设置背景图的大小，保证始终能铺满全屏
  h = $(window).height();
  w = $(window).width();
  l = $("#left");
  r = $("#right");

  var wh = w / h;
  if (wh < 1.6) {
    $("#box3d_a").css("background-size", "auto " + h + "px");
  } else {
    $("#box3d_a").css("background-size", w + "px auto");
  }
  $("#box3d_girl").css("margin-left", -((((h * 7) / 10) * 306) / 450) / 2);
  $("body").on("mousemove", girlmove);

  //绑定按钮点击事件
  $("#l_gbr").on("click", show1);

  //绑定按钮点击事件
  $("#l_gbl").on("click", inIndex);

  //绑定window对象改变大小时事件
  $(window).on("resize", windowResize);
}

/**
	初始化完毕后，页面出现
*/
function pageShow() {
  l = $("#left");
  r = $("#right");

  $("#logo,#footer").fadeIn(600);
  $("#box3d_a").css({ transform: "rotateX(0deg) rotateY(0deg)", "-webkit-transform": "rotateX(0deg) rotateY(0deg)", opacity: "1" });

  $("#l_gbr_box")
    .css({ top: "-150px", "margin-left": "-185px", opacity: "0" })
    .delay(1000)
    .animate({ top: "-100px", "margin-left": "-235px", opacity: "1" }, 1500, "easeInOutQuad");
  $("#l_gbl_box")
    .css({ top: "-50px", "margin-left": "-25px", opacity: "0" })
    .delay(1000)
    .animate({ top: "-100px", "margin-left": "25px", opacity: "1" }, 1500, "easeInOutQuad");
}

/**
	女孩跟随鼠标移动
*/
function girlmove(e) {
  $("#box3d_girl").css({ left: w / 2 - (e.pageX - w / 2) / 50 + "px" });
}

/**
	window对象改变大小后，重新设定各参数
*/
function windowResize() {
  h = $(window).height();
  w = $(window).width();
  var wh = w / h;
  if (wh < 1.6) {
    $("#box3d_a").css("background-size", "auto " + h + "px");
  } else {
    $("#box3d_a").css("background-size", w + "px auto");
  }
  console.log(h + "," + w);
  console.log($("#box3d_girl").height());
  $("#box3d_girl").css("margin-left", -($("#box3d_girl").width() / 2));
}

/**
	片头动画
*/
var time1 = null; //第1阶段img timer计时器
var tag = 0; //一个标记 0-19,用于第1段图片轮播
var tagi = 0; //用于第1段图片轮播到了第几张图片

function show1() {
  //绑定动画结束事件
  document.getElementById("s").addEventListener("webkitAnimationEnd", show1Img, false);
  document.getElementById("s").addEventListener("MSAnimationEnd", show1Img, false);
  document.getElementById("s").addEventListener("animationend", show1Img, false);

  $("#l_gbr").css({ "-webkit-transform": "rotate(-45deg) translate(175px,95px)", transform: "rotate(-45deg) translate(175px,95px)" });
  $("#l_gbl").css({ "-webkit-transform": "rotate(-45deg) translate(-244px,65px)", transform: "rotate(-45deg) translate(-244px,65px)" });
  $("#logo,#footer").fadeOut(600);
  $("#box3d")
    .delay(600)
    .fadeOut(300, function() {
      l.addClass("flShow1");
      r.addClass("frShow1");

      if (!!document.createElement("audio").canPlayType) {
        $("#showmusic")
          .get(0)
          .play();
      }

      $(window)
        .delay(500)
        .show(0, function() {
          $("#box").css("display", "block");
          tagi = 0;
          show1Img();
          $("#words")
            .html("我穿过<br/>&nbsp;&nbsp;&nbsp;&nbsp城市和人海")
            .addClass("word1Show");
        });
    });
}

/* box部分 */

/* 第2阶段左右动画 并触发主动画 */
function show2() {
  //绑定动画结束事件
  document.getElementById("s").addEventListener("webkitAnimationEnd", show2Img, false);
  document.getElementById("s").addEventListener("MSAnimationEnd", show2Img, false);
  document.getElementById("s").addEventListener("animationend", show2Img, false);

  l.addClass("lShow2");
  r.addClass("rShow2");

  $(window)
    .delay(1300)
    .show(0, function() {
      $("#s").css({ width: "45%", left: "45%", height: "150%", opacity: 0, "background-image": "url(kernel/index/img/welcome/z1.jpg)" });
      $("#s_2").css({ opacity: "0", "background-image": "url(kernel/index/img/welcome/z1.jpg)" });
      $("#left,#right").fadeOut(0);
      tagi = 0;
      tag = 0;
      show2Img();
      $("#words")
        .removeClass("word1Out")
        .addClass("word1Show");
      $("#words")
        .css({ left: "20%", top: "45%", bottom: "auto", right: "auto" })
        .html("我翻越<br/>&nbsp;&nbsp;&nbsp;&nbsp崇山和峻岭");
    });
}

/* 第3阶段左右动画 并触发主动画 */
function show3() {
  //绑定动画结束事件
  document.getElementById("s").addEventListener("webkitAnimationEnd", show3Img, false);
  document.getElementById("s").addEventListener("animationend", show3Img, false);

  l.addClass("lShow3");
  r.addClass("rShow3");

  $(window)
    .delay(1400)
    .show(0, function() {
      $("#s").css({ width: "130%", height: "130%", left: "-15%", top: "-15%", display: "block", opacity: "0", "background-image": "url(kernel/index/img/welcome/x1.jpg)" });
      tagi = 0;
      show3Img();
      $("#words")
        .css({ top: "55%", left: "50%", "text-align": "center", "margin-left": "-150px" })
        .html("去追寻智慧的洋流")
        .removeClass("word1Out word1Show")
        .addClass("word1Showl");
      var s3dall = $(".s3d_d");
      for (var i = 0; i < 5; i++) {
        s3dall
          .eq(i)
          .delay(200 * i)
          .fadeIn(300);
        s3dall
          .eq(9 - i)
          .delay(200 * i)
          .fadeIn(300);
      }
    });
}

/* 第4阶段左右动画 并触发主动画 */
function show4() {
  document.getElementById("s").removeEventListener("webkitAnimationEnd", show3Img, false);
  document.getElementById("s").removeEventListener("animationend", show3Img, false);

  l.addClass("lShow4");
  r.addClass("rShow4");
  $("#s3d_1").css({ "-webkit-transform": "rotateX(45deg) rotateY(30deg) rotateZ(0deg) translateZ(100px)", transform: "rotateX(45deg) rotateY(30deg) rotateZ(0deg) translateZ(100px)", left: "70%", top: "70%" });
  $("#s3d_2").css({ "-webkit-transform": "rotateX(-20deg) rotateY(20deg) rotateZ(20deg) translateZ(-100px)", transform: "rotateX(-20deg) rotateY(20deg) rotateZ(20deg) translateZ(-100px)", left: "65%", top: "60%" });
  $("#s3d_3").css({ "-webkit-transform": "rotateX(45deg) rotateY(-30deg) rotateZ(60deg) translateZ(200px)", transform: "rotateX(45deg) rotateY(-30deg) rotateZ(60deg) translateZ(200px)", left: "80%", top: "95%" });
  $("#s3d_4").css({ "-webkit-transform": "rotateX(10deg) rotateY(30deg) rotateZ(10deg) translateZ(-200px)", transform: "rotateX(10deg) rotateY(30deg) rotateZ(10deg) translateZ(-200px)", left: "40%", top: "40%" });
  $("#s3d_5").css({ "-webkit-transform": "rotateX(45deg) rotateY(-30deg) rotateZ(60deg) translateZ(0px)", transform: "rotateX(45deg) rotateY(-30deg) rotateZ(60deg) translateZ(0px)", left: "15%", top: "30%" });
  $("#s3d_6").css({ "-webkit-transform": "rotateX(45deg) rotateY(-20deg) rotateZ(10deg) translateZ(-250px)", transform: "rotateX(45deg) rotateY(-20deg) rotateZ(10deg) translateZ(-250px)", left: "80%", top: "-10%" });
  $("#s3d_7").css({ "-webkit-transform": "rotateX(-45deg) rotateY(30deg) rotateZ(-30deg) translateZ(-50px)", transform: "rotateX(-45deg) rotateY(30deg) rotateZ(-30deg) translateZ(-50px)", left: "60%", top: "45%" });
  $("#s3d_8").css({ "-webkit-transform": "rotateX(45deg) rotateY(10deg) rotateZ(0deg) translateZ(-300px)", transform: "rotateX(45deg) rotateY(10deg) rotateZ(0deg) translateZ(-300px)", left: "0", top: "-10%" });
  $("#s3d_9").css({ "-webkit-transform": "rotateX(-15deg) rotateY(40deg) rotateZ(0deg) translateZ(0px)", transform: "rotateX(-15deg) rotateY(40deg) rotateZ(0deg) translateZ(0px)", left: "5%", top: "60%" });
  $("#s3d_10").css({ "-webkit-transform": "rotateX(45deg) rotateY(-30deg) rotateZ(20deg) translateZ(30px)", transform: "rotateX(45deg) rotateY(-30deg) rotateZ(20deg) translateZ(30px)", left: "43%", top: "45%" });
  $(window)
    .delay(1400)
    .show(0, function() {
      $("#s3d")
        .addClass("d3turn")
        .delay(1900)
        .show(0, function() {
          $(".s3d_d")
            .css({ "-webkit-transform": "translateZ(1500px)", transform: "translateZ(1500px)", left: "43%", top: "43%" })
            .fadeOut(1500);
          setTimeout("show5()", 1500);
        }); //开始3D旋转
    });
}

/* 最后一阶段 */
function show5() {
  $(".lastword")
    .addClass("lastwordshow")
    .delay(3000)
    .show(0, function() {
      $("#box").fadeOut(400, function() {
        //location=location;

        returnInit();
      });
    });
}

/* 第1阶段主动画 完毕后触发第2阶段左右动画 */
function show1Img() {
  tagi++;
  var s = document.getElementById("s");
  s.classList.remove("s_tran");
  if (tagi >= 4) {
    document.getElementById("s").removeEventListener("webkitAnimationEnd", show1Img, false);
    document.getElementById("s").removeEventListener("MSAnimationEnd", show1Img, false);
    document.getElementById("s").removeEventListener("animationend", show1Img, false);

    s.style.opacity = "0";
    $("#words").addClass("word1Out");
    show2();
  } else {
    s.style.backgroundImage = "url(kernel/index/img/welcome/y" + tagi + ".jpg)";
    setTimeout(function() {
      s.classList.add("s_tran");
    }, 30);
  }
}

/* 第2阶段主动画 完毕后触发第3阶段左右动画 */
function show2Img() {
  var s = document.getElementById("s");
  var s2 = document.getElementById("s_2");
  s.classList.remove("show2_s_tran");
  s2.classList.remove("show2_s2_tran");
  tagi++;
  if (tagi >= 4) {
    document.getElementById("s").removeEventListener("webkitAnimationEnd", show2Img, false);
    document.getElementById("s").removeEventListener("MSAnimationEnd", show2Img, false);
    document.getElementById("s").removeEventListener("animationend", show2Img, false);

    $("#words").addClass("word1Out");
    $("#s,#s_2").fadeOut(200);
    $("#left,#right").fadeIn(200);
    show3();
  } else {
    $("#s").css({ "background-image": "url(kernel/index/img/welcome/z" + tagi + ".jpg)" });
    $("#s_2").css({ "background-image": "url(kernel/index/img/welcome/z" + tagi + ".jpg)" });

    setTimeout(function() {
      s.classList.add("show2_s_tran");
      s2.classList.add("show2_s2_tran");
    }, 30);
  }
}

/* 第3阶段主动画 */
function show3Img() {
  var s = document.getElementById("s");
  //s.classList.remove("show3_s_tran");

  if (tagi >= 1) {
    $("#words").addClass("word1Outl");
    show4();
  } else {
    tagi++;
    s.classList.add("show3_s_tran");
  }
}

function inIndex() {
  $("#l_gbr").css({ "-webkit-transform": "rotate(-45deg) translate(175px,95px)", transform: "rotate(-45deg) translate(175px,95px)" });
  $("#l_gbl").css({ "-webkit-transform": "rotate(-45deg) translate(-244px,65px)", transform: "rotate(-45deg) translate(-244px,65px)" });
  $("body")
    .delay(200)
    .fadeOut(500, function() {
      location.href = "/home.html";
    });
}

var returninith =
  '<div id="left"></div><div id="right"></div><div id="s_2"></div><div id="s"></div><div id="words"></div>' +
  '<div id="s3d"><div class="s3d_d" id="s3d_1"></div><div class="s3d_d" id="s3d_2"></div><div class="s3d_d" id="s3d_3"></div><div class="s3d_d" id="s3d_4"></div>' +
  '<div class="s3d_d" id="s3d_5"></div><div class="s3d_d" id="s3d_6"></div><div class="s3d_d" id="s3d_7"></div><div class="s3d_d" id="s3d_8"></div><div class="s3d_d" id="s3d_9"></div><div class="s3d_d" id="s3d_10"></div>' +
  '</div><div class="lastword" id="word1">isLuo</div><div class="lastword" id="word2">我就是我 是颜色不一样的烟火</div><div class="lastword" id="word3">欢迎访问我的世界</div><div class="lastword" id="word4">isluo.com</div>';

function returnInit() {
  $("#box3d_a").removeClass("l_transition2");
  $("#l_gbr").removeClass("l_transition05");
  $("#l_gbl").removeClass("l_transition05");
  $("#box").css("display", "none");
  $("#l_gbr_box,#l_gbl_box").css("opacity", "0");
  setTimeout(function() {
    $("#box3d_a").css({ transform: "rotateX(-5deg) rotateY(10deg) translateZ(150px)", "-webkit-transform": "rotateX(-5deg) rotateY(10deg) translateZ(150px)", opacity: "0" });
    $("#l_gbr").css({ "-webkit-transform": "rotate(-45deg) translate(37px,95px)", transform: "rotate(-45deg) translate(37px,95px)" });
    $("#l_gbl").css({ "-webkit-transform": "rotate(-45deg) translate(-109px,65px)", transform: "rotate(-45deg) translate(-109px,65px)" });
    $("#box").html(returninith);
    setTimeout(function() {
      $("#box3d").fadeIn(0);
      $("#box3d_a").addClass("l_transition2");
      $("#l_gbr").addClass("l_transition05");
      $("#l_gbl").addClass("l_transition05");
      setTimeout("pageShow()", 16);
    }, 16);
  }, 16);
}
