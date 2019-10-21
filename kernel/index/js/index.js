var baseip = "https://isluo.com";
var nowpage = 0; //记录当前位置在第几页，用于在当前页时，点击导航不重复触发滑动动画
var lastRunTime = new Date(); //防止滚轮事件重复触发
var pageimgnum = 2; //page1图片轮播的下一张图片的编号
var timer1; //首页图片轮播的计时器
var mp3now = 1; //记录当前正在播放第几首歌
var mp3all = 5; //记录总共有多少首歌
var page4aok = 1; //第4页旋转动画是否已被初始化 1为已初始化
var facenow = 0; //标识face窗口是否已显示，0未显示，1显示
var windowTimer; //专门用于窗口大小改变时触发的事件的定时器
var messagetime = 6; //留言间隔时间

window.onload = function() {
  //开始页面初始化
  //消除手机端click事件延迟
  //FastClick.attach(document.body);
  if (document.cookie.indexOf("userCookie") < 0) {
    document.cookie = "userCookie=" + new Date().getTime();
  }
  /* 绑定鼠标移动到导航按钮上的事件 */
  $(".daohang_d")
    .on("mouseenter", function() {
      daohang_in(this);
    })
    .on("mouseleave", function() {
      daohang_out(this);
    })
    .on("click", function() {
      daohang_move(this);
    });

  /* 绑定小纸条按钮hover事件 */
  $("#littleword")
    .on("mouseenter", function() {
      liWordHover(this);
    })
    .on("mouseleave", function() {
      liWordOut(this);
    })
    .on("click", function() {
      liWordBoxShow();
    });

  /* 绑定小纸条编辑区焦点事件 */
  $("#lit_allwords")
    .on("focus", function() {
      wordsInfoIn();
    })
    .on("blur", function() {
      wordsInfoOut();
    })
    .on("keyup", function() {
      wordsChange();
    });

  /* 绑定鼠标滚轮滚动时，滑动到对应的页面 */

  $("body").bind("mousewheel", function(e, delta) {
    mouseWheels(e, delta);
  });

  //启动首页的图片轮播
  timer1 = window.setInterval("pagerun()", 15000);

  //绑定window对象改变大小时事件
  $(window).on("resize", windowResize);

  //初始化mp3info的位置
  initMp3Info();

  //绑定MP3按钮点击事件
  $("#mp3box").on("click", mp3btnClick);

  //绑定MP3一曲结束事件
  $("#mp3audio")
    .on("ended", mp3next)
    .on("loadstart", mp3loading)
    .on("play", mp3loadover);

  //绑定点击曲目时的事件
  $(".mp3_1").on("click", function() {
    mp3listClick(this);
  });

  //初始化该播放哪一首歌曲
  initMp3();

  //禁止img、a的drag事件
  nodrag();

  //绑定小纸条关闭按钮事件
  $("#litwordclose").on("click", wordsClose);

  //初始化表情图片
  // initAllFaces();

  //绑定face按钮相关事件
  $("#lit_face").on("click", faceTarger);
  $("#lit_allwords").on("click", faceOut);

  //绑定选择表情事件
  $("#lit_allfaces img")
    .css("cursor", "pointer")
    .on("click", function() {
      faceChose(this);
    });

  //绑定page2导航按钮点击事件
  $("#p2_dh_btn0").on("click", p2dhTarger);

  //初始化页面中的所有滚动条
  initScrollbar("movedh");
  initScrollbar2("movielr");
  initScrollbar2("articlebox");
  initScrollbar2("gamebox");
  initScrollbar2("page3_list");

  //禁止第2页中某些部件上的滚轮事件
  noScroll();

  //绑定第2页我的导航按钮点击事件
  $(".myting").on("click", function() {
    mytingbtnClick(this);
  });

  //绑定第2页文章关闭按钮
  $("#wenzhang_close").on("click", wenzhangClose);

  //绑定第2页游戏关闭按钮
  $("#game_close").on("click", gameClose);

  //绑定第3页work关闭按钮
  $("#mywork_close").on("click", closeWork);

  //绑定发送留言按钮
  $("#lit_okbtn").on("click", putMessage);

  //绑定留言加载更多按钮
  $("#messageloadmore").on("click", getMoreMessage);

  //ajax获取第3页列表
  getAllWorks();

  //初始化完毕，页面显示
  $("#boss,#footer").fadeIn(500, startPage1show);
  $("#daohang")
    .css("visibility", "visible")
    .animate({ opacity: "1" }, 1000);
  l_loadingOut();
};

/* 滚轮滚动事件 */
function mouseWheels(e, delta) {
  if (new Date() - lastRunTime > 500) {
    lastRunTime = new Date();
    if (delta > 0 && nowpage > 0) {
      daohang_moveg(nowpage - 1);
    } else if (delta < 0 && nowpage < 3) {
      daohang_moveg(nowpage + 1);
    }
  }
  return false;
}

/* 将鼠标移动到导航按钮上的效果 */
function daohang_in(the) {
  var $the = $(the);
  $the
    .css({ "border-bottom-color": "#FFFFFF", "background-color": "rgba(0,0,0,.3)" })
    .children(".daohang_t")
    .stop()
    .animate({ width: "100%", left: "0" }, 300);
  $the
    .children(".daohang_l,.daohang_r")
    .stop()
    .animate({ height: "100%" }, 300);
  $the
    .children(".daohang_word")
    .stop()
    .animate({ right: "2em" }, 300);
}

/* 将鼠标移出导航按钮上后恢复原始状态 */
function daohang_out(the) {
  var $the = $(the);

  $the
    .css({ "border-bottom-color": "#CCCCCC", "background-color": "transparent" })
    .children(".daohang_t")
    .stop()
    .animate({ width: "0", left: "50%" }, 300);
  $the
    .children(".daohang_l,.daohang_r")
    .stop()
    .animate({ height: "0" }, 300);
  $the
    .children(".daohang_word")
    .stop()
    .animate({ right: "-100%" }, 300);
}

/* 点击导航按钮，滑动到相应位置 */
function daohang_move(the) {
  var pagenum = parseInt($(the).data("pagenum"));
  if (pagenum != nowpage) {
    /* 表明当前显示的页和点击的按钮不是同一页 */
    $("#boss").animate({ top: -pagenum * 100 + "%" }, 600);
    nowpage = pagenum;
    window.clearInterval(timer1);
    if (nowpage == 0) {
      timer1 = window.setInterval("pagerun()", 15000);
      initPage4a();
    } else if (nowpage == 3) {
      page4aok = 0;
      $("#myphoto,#weima2").css({ transform: "rotate(0deg) scale(1,1)", "-webkit-transform": "rotate(0deg) scale(1,1)" });
    } else {
      initPage4a();
    }
  }
}

//初始化第4页旋转动画，这么做是为了每次切换页面时不用都执行一次初始化
function initPage4a() {
  if (!page4aok) {
    page4aok = 1;
    $("#myphoto,#weima2").css({ transform: "rotate(-480deg) scale(.5,.5)", "-webkit-transform": "rotate(-480deg) scale(.5,.5)" });
  }
}
/* 鼠标滚轮滚动时，滑动到相应位置 */
function daohang_moveg(pagenum) {
  $("#boss").animate({ top: -pagenum * 100 + "%" }, 600);
  nowpage = pagenum;
  window.clearInterval(timer1);
  if (nowpage == 0) {
    timer1 = window.setInterval("pagerun()", 15000);
    initPage4a();
  } else if (nowpage == 3) {
    page4aok = 0;
    $("#myphoto,#weima2").css({ transform: "rotate(0deg) scale(1,1)", "-webkit-transform": "rotate(0deg) scale(1,1)" });
  } else {
    initPage4a();
  }
}

/**
	window对象改变大小后，重新设定各参数
*/
function windowResize() {
  //var h = $(window).height();
  //var w = $(window).width();
  //$(".container_skitter,.box_clone,.label_skitter").css({"height":h+"px","width":w+"px"});
  window.clearTimeout(windowTimer);
  windowTimer = window.setTimeout(function() {
    initWordsHeight(); //重新初始化小纸条编辑区高度
    initMovieDivHeight(); //重新初始化第2页电影详细内容div的高度
  }, 200);
}

/* page1图片轮换 */
function pagerun() {
  var p2 = $("#pageimgbox2").css("display");

  if (p2 == "block") {
    $("#pageimgbox1").css("background-image", "url(kernel/index/img/home" + pageimgnum + ".jpg)");
    $("#pageimgbox2").fadeOut(500);
  } else {
    $("#pageimgbox2").css("background-image", "url(kernel/index/img/home" + pageimgnum + ".jpg)");
    $("#pageimgbox2").fadeIn(500);
  }

  pageimgnum++;
  if (pageimgnum >= 4) {
    pageimgnum = 1;
  }
}

/* 点击MP3按钮时触发 */
function mp3btnClick() {
  var $m = $("#mp3body");

  if ($m.css("opacity") == "0") {
    $("#mp3body3dbox").css("display", "block");
    var top = parseInt($("#mp3box").css("top"));
    var hei = $("#mp3box").height();
    $("#mp3body3dbox").css({ bottom: hei - top + "px" });
    window.setTimeout(function() {
      $("#mp3body").css({ opacity: "1", transform: "rotateX(0deg) rotateY(0deg)", "-webkit-transform": "rotateX(0deg) rotateY(0deg)" });
    }, 0); //这么做是为了display=block后留点延迟，不然css过渡没效果
  } else {
    $m.css("opacity", "0");
    window.setTimeout(function() {
      $("#mp3body3dbox").css("display", "none");
      $m.css({ transform: "rotateX(15deg) rotateY(15deg)", "-webkit-transform": "rotateX(15deg) rotateY(15deg)" });
    }, 500);
  }
}

/* 一首歌曲播放完毕后 播放下一首 */
function mp3next() {
  mp3now++;
  if (mp3now > mp3all) {
    mp3now = 1;
  }
  $("#mp3audio").attr("src", "kernel/index/mp3/b" + mp3now + ".mp3");
  $(".mp3name").css("color", "#ffffff");
  $(".mp3name")
    .eq(mp3now - 1)
    .css("color", "#55ff55");

  setLocVal("mp3now", mp3now);
}

//初始化该播放哪一首歌曲
function initMp3() {
  var mp3 = getLocVal("mp3now");
  if (mp3) mp3now = mp3 - 1;
  else mp3now = 0;
  $("#mp3audio").prop("autoplay", "true");
  mp3next();
}

//点击曲目 播放相应的歌曲
function mp3listClick(t) {
  var temp = $(t).data("mp3num");
  if (temp == mp3now) return;

  mp3now = temp - 1;
  mp3next();
}

//MP3正在加载时 显示缓冲中
function mp3loading() {
  $("#mp3info")
    .text("缓冲中...")
    .css("display", "block");
}

//MP3缓冲完毕即将播放时
function mp3loadover() {
  $("#mp3info").css("display", "none");
}

//初始化mp3info的位置
function initMp3Info() {
  var mp3h = $("#mp3audio").height();
  $("#mp3info").css("bottom", mp3h + "px");
}

//小纸条按钮hover效果
function liWordHover(the) {
  var $the = $(the);
  $the
    .css({ "background-color": "rgba(0,0,0,.3)" })
    .children(".lit_t,.lit_b")
    .stop()
    .animate({ width: "100%" }, 300);
  $the
    .children(".lit_l,.lit_r")
    .stop()
    .animate({ height: "100%" }, 300);
}

/* 将鼠标移出导航按钮上后恢复原始状态 */
function liWordOut(the) {
  var $the = $(the);
  $the
    .css({ "background-color": "transparent" })
    .children(".lit_t,.lit_b")
    .stop()
    .animate({ width: "0" }, 300);
  $the
    .children(".lit_l,.lit_r")
    .stop()
    .animate({ height: "0" }, 300);
}

//打开小纸条窗口
function liWordBoxShow() {
  $("#litword3dbox").css("display", "block");
  window.setTimeout(function() {
    $("#litwordbox").css({ transform: "rotateX(0deg)", "-webkit-transform": "rotateX(0deg)", opacity: "1" });
  }, 0);
  $("#mubu").fadeIn(300, function() {
    $("#litwordclose").animate({ top: "-2em", opacity: "show" }, 600);
  });
  $("body").unbind("mousewheel");

  var $lr = $("#lit_boxr");
  if ($lr.find(".iload").length > 0) {
    //说明没有加载过，开始加载第1页的留言数据
    const query = `query getMessage($page:Int!){
      message(page:$page){
        info,
        time,
        username
      }
    }`;

    $.ajax({
      url: "/graphql",
      type: "get",
      data: {
        query,
        variables: JSON.stringify({ page: 0 }),
      },
      success: getMessageBack,
    });
  }
}

//关闭小纸条窗口
function wordsClose() {
  $("#litwordbox").css({ transform: "rotateX(45deg)", "-webkit-transform": "rotateX(45deg)", opacity: "0" });
  $("#mubu").fadeOut(300);
  $("#litwordclose").css({ display: "none", top: "0" });
  $("body").bind("mousewheel", function(e, delta) {
    mouseWheels(e, delta);
  });
  window.setTimeout(function() {
    $("#litword3dbox").css("display", "none");
    faceOut();
  }, 300);
}

//书写区获得焦点
function wordsInfoIn() {
  var $w = $("#lit_allwords");
  if (trim($w.html()) == "请在这里输入内容") {
    $w.html("").css("color", "#c8c8c8");
  }
}

//书写区失去焦点
function wordsInfoOut() {
  var $w = $("#lit_allwords");
  if (trim($w.html()) == "") {
    $w.html("请在这里输入内容").css("color", "#61544a");
  }
}

//书写区文本改变，计算字数
function wordsChange() {
  var lo = $("#lit_allwords").html().length;
  var $w = $("#lit_wordsnum");
  $w.text(lo + "/300");
  if (lo < 300) {
    $w.css("color", "#61544a");
  } else {
    $w.css("color", "#ff0000");
  }
}

//首次进入页面时，把表情图片加入到allfaces中
function initAllFaces() {
  var str = "";
  for (var i = 1; i <= 75; i++) {
    str += "<img src='f/" + i + ".gif'>";
  }
  $("#lit_allfaces").append(str);

  setTimeout("initWordsHeight()", 0);
}

//并且初始化编辑区的高度
function initWordsHeight() {
  var fsize = parseInt(window.getComputedStyle(document.querySelector("html"), null).fontSize);
  var h = $("#page4").height() / 2 - 5.5 * fsize - 2;
  $("#lit_allwords").css("height", h + "px");
}

//face窗口出现与隐藏
function faceTarger() {
  if (facenow == 0) {
    faceShow();
  } else {
    faceOut();
  }
}

//点击face按钮，face窗口出现
function faceShow() {
  facenow = 1;
  $("#lit_allfaces")
    .stop()
    .animate({ bottom: "2.5em", opacity: "show" }, { easing: "easeInOutQuart", duration: 300 });
}

//face窗口隐藏
function faceOut() {
  if (facenow == 1) {
    facenow = 0;
    $("#lit_allfaces").css({ bottom: "0", display: "none" });
  }
}

//点击表情，选择表情
function faceChose(t) {
  var $w = $("#lit_allwords");
  if ($w.html() == "请在这里输入内容") {
    $w.html("<img src='" + $(t).attr("src") + "'>").css("color", "#c8c8c8");
  } else {
    $w.append("<img src='" + $(t).attr("src") + "'>");
  }
  faceOut();
  wordsChange();
}

//page2导航按钮点击交替事件
function p2dhTarger() {
  var $dh = $("#p2_daohang");
  var $dhb = $("#p2_dh_btn0");

  if ($dh.css("left") != "0px") {
    $dh.css("left", "0px");
    $dhb.css({ transform: "rotateY(180deg)", "-webkit-transform": "rotateY(180deg)" });
  } else {
    $dh.css("left", "-15em");
    $dhb.css({ transform: "rotateY(0deg)", "-webkit-transform": "rotateY(0deg)" });
  }
}

//页面中的所有水平滚动条初始化
function initScrollbar(tid) {
  $("#" + tid).mCustomScrollbar({
    horizontalScroll: true, //水平滚动条
    mouseWheelPixels: 200, //滚轮滑动一次滚动的距离
    scrollInertia: 350, //滚动的惯性值
    scrollEasing: "linear", //滚动速度曲线
    autoHideScrollbar: true, //自动隐藏滚动条
    theme: "dark",
    advanced: {
      autoExpandHorizontalScroll: true, //当有任何变化时，自动处理水平滚动条的长度
      updateOnBrowserResize: true, //外框大小变化时，自动调整滚动条
      updateOnContentResize: true, //内容变化时，自动调整滚动条状态
    },
  });
}

//页面中的所有垂直滚动条初始化
function initScrollbar2(tid) {
  $("#" + tid).mCustomScrollbar({
    mouseWheelPixels: 200, //滚轮滑动一次滚动的距离
    scrollInertia: 350, //滚动的惯性值
    scrollEasing: "linear", //滚动速度曲线
    autoHideScrollbar: true, //自动隐藏滚动条
    theme: "dark",
    advanced: {
      autoExpandHorizontalScroll: true, //当有任何变化时，自动处理水平滚动条的长度
      updateOnBrowserResize: true, //外框大小变化时，自动调整滚动条
      updateOnContentResize: true, //内容变化时，自动调整滚动条状态
    },
  });
}

//点击页面2导航中的按钮出现相应的div,其他div消失
function mytingbtnClick(the) {
  $(".p2_divs,#page2show")
    .stop()
    .fadeOut(300);
  var tid = the.getAttribute("id");

  if (tid == "myting_movie") {
    //点击电影
    $("#p2_movie")
      .stop()
      .fadeIn(300);
    initMovieDivHeight();
    if ($("#movedh").find(".movecard").length <= 0) {
      getMovieList(0);
    }
  } else if (tid == "myting_article") {
    //点击文章
    $("#p2_article")
      .stop()
      .fadeIn(300);
    if ($("#articlebox").find(".articlelist").length <= 0) {
      getArticleList();
    }
  } else if (tid == "myting_game") {
    //点击游戏
    $("#p2_game")
      .stop()
      .fadeIn(300);
    if ($("#gamebox").find(".game_i").length <= 0) {
      getGameList();
    }
  }
}

//加载全部文章列表
var getArticleListA = 0; //1为正在请求，0为空闲
function getArticleList() {
  if (getArticleListA == 1) {
    return;
  }
  getArticleListA = 1;
  const query = `query{
    article{
      id,
      title,
      author,
      imgpath
    }
  }`;
  $.ajax({
    url: "/graphql",
    type: "get",
    data: {
      query,
    },
    success: getArticleListBack,
    error: function() {
      bodyMessage("加载失败");
      getArticleListA = 0;
    },
  });
  // $.ajax({
  //   url: 'main/todo.do',
  //   type: 'get',
  //   data: 'm=getArticleList&p=',
  //   success: getArticleListBack,
  //   error: function() {
  //     bodyMessage('加载失败');
  //     getArticleListA = 0;
  //   },
  // });
}

//加载全部game列表
var getGameListA = 0; //1为正在请求，0为空闲
function getGameList() {
  if (getGameListA == 1) {
    return;
  }
  getGameListA = 1;
  const query = `query{game{
    id
    name
    imgpath
  }}`;
  $.ajax({
    url: "/graphql",
    type: "GET",
    data: {
      query,
    },
    success: getGameListBack,
    error: function() {
      bodyMessage("加载失败");
      getGameListA = 0;
    },
  });
  // $.ajax({
  //   url: 'main/todo.do',
  //   type: 'get',
  //   data: 'm=getGameList&p=',
  //   success: getGameListBack,
  //   error: function() {
  //     bodyMessage('加载失败');
  //     getGameListA = 0;
  //   },
  // });
}
//加载更多movie列表
var getMovieListA = 0;
function getMovieList(pageNow) {
  if (getMovieListA == 1) {
    return;
  }
  getMovieListA = 1;

  const query = `query func($pageNow: Int!){
    rows:movie(pageNow: $pageNow){
      id
      title
			imgpath
		}
  }`;

  $.ajax({
    url: "/graphql",
    type: "GET",
    // headers: {
    //   'Content-Type': 'application/json',
    //   Accept: 'application/json',
    // },
    data: {
      query,
      variables: JSON.stringify({ pageNow: 0 }),
    },
    success: getMovieListBack,
    error: function() {
      bodyMessage("加载失败");
    },
  });
  // $.ajax({
  //   url: 'main/todo.do',
  //   type: 'get',
  //   data: 'm=getMovieList&p=' + pageNow,
  //   success: getMovieListBack,
  //   error: function() {
  //     bodyMessage('加载失败');
  //   },
  // });
}

//点击加载更多电影的按钮
function movieloadmore() {
  var pagenow = $("#movedh").find(".movecard").length;
  getMovieList(pagenow);
}

//禁止某些部件上的滚轮事件
function noScroll() {
  $("#movedh,#movielr,#wenzhang,#articlebox,#youxi,#page3_list,#mywork,#gamebox").on("mousewheel", function(e, data) {
    e.stopPropagation();
  });
}

//初始化第2页电影详细内容div的高度
function initMovieDivHeight() {
  var h = $("#movedh")[0].offsetTop - 50;
  if (h && h > 0) {
    $("#movielr").height(h);
  }
}

//开始首页的动画
function startPage1show() {
  var style = document.getElementById("page1show").style;
  style.top = "30%";
  style.opacity = "1";

  var style_l = document.getElementById("page1show_line").style;
  style_l.width = "24em";
  style_l.marginLeft = "-12em";
}

//点击文章关闭按钮，关闭文章详细div
function wenzhangClose() {
  var $wenzhang = $("#wenzhang");

  $("#wenzhangl,#wenzhangr").css("display", "none");

  $wenzhang.animate({ height: "1%", top: "48%" }, 500, function() {
    $wenzhang.animate({ width: "0", left: "50%" }, 300, function() {
      $wenzhang.css("display", "none");
    });
  });
}

//点击游戏关闭按钮，关闭游戏详细div
function gameClose() {
  var $youxi = $("#youxi");

  $youxi.animate({ left: "100%" }, 300, function() {
    $("#youxi_1,#youxi_2,#youxi_3").css({ "margin-top": "20px", opacity: "0" });
  });
}

//点击P3按钮移动对应的大图
function gotoTheP3Img(num) {
  var nowone = $(".p3thisone", "#page3_bigimg").eq(0); //当前的大图对象
  var nownum = nowone.data("num"); //当前的序号

  if (num == nownum) {
    return;
  }

  var thisone = $("#bigimg_" + num); //目标大图

  var thisword = $("#bigword_" + num); //目标文字
  var nowword = $(".p3thisword", "#page3_word").eq(0); //当前的文字对象

  var thisbtn = $("#bigbtn_" + num); //目标按钮
  var nowbtn = $(".bigbtncolor", "#page3_list").eq(0); //当前按钮对象

  if (nownum > num) {
    thisone.css("top", "-100%");
    thisword.css("top", "-100%");

    nowone.animate({ top: "100%" }, 500);
    nowword.animate({ top: "100%" }, 500);
  } else {
    thisone.css("top", "100%");
    thisword.css("top", "100%");

    nowone.animate({ top: "-100%" }, 500);
    nowword.animate({ top: "-100%" }, 500);
  }
  thisone.animate({ top: "0" }, 500);
  thisword.animate({ top: "0" }, 500);

  thisone.addClass("p3thisone");
  thisword.addClass("p3thisword");

  nowone.removeClass("p3thisone");
  nowword.removeClass("p3thisword");

  thisbtn.addClass("bigbtncolor");
  nowbtn.removeClass("bigbtncolor");
}

//关闭具体的work页
function closeWork() {
  $("#mywork").animate({ top: "50%", height: "0" }, 600, function() {
    $("#mywork").css({ width: "0" });
    $("#myworkbox").css("display", "none");
  });
}

//显示窗口提示
var messagetimer;
function bodyMessage(info) {
  $("#body_m").text(info);
  $("#body_message")
    .stop()
    .fadeIn(200);
  clearTimeout(messagetimer);
  messagetimer = setTimeout(function() {
    $("#body_message").fadeOut(200);
  }, 1600);
}

//点击留言的发送按钮，开始ajax留言
function putMessage() {
  var info = trim($("#lit_allwords").html());
  var username = $("#username").val();
  username = username ? username : "游客";

  if (info.length > 300) {
    bodyMessage("您说得太多了");
    return;
  } else if (info == "请在这里输入内容" || info == "") {
    bodyMessage("留言内容不能为空");
    return;
  }

  var nowtime = new Date();
  if (nowtime - messagetime <= 5000) {
    bodyMessage("您说得太快了");
    return;
  } else {
    messagetime = nowtime;
  }

  var param = encodeURIComponent(encodeURIComponent(username + "@@" + info));

  bodyMessage("正在发送...");

  const mutation = `mutation CreateMessage($input: MessageInput){
    createMessage(input: $input){
      id
      info
      username
      time
    }
  }`;

  $.ajax({
    url: "/graphql",
    type: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          name: username,
          info: info,
        },
      },
    }),
    success: putMessageBack,
    error: function() {
      bodyMessage("留言失败");
    },
  });
}

//点击留言板加载更多按钮
function getMoreMessage() {
  var $m = $("#messageloadmore");
  var mtext = $m.text();
  if (mtext != "显示更多") {
    return;
  }

  var pageNow = $(".lit_userwords", "#lit_boxr").length;
  $m.text("正在加载...");
  const query = `query getMessage($page:Int!){
    message(page:$page){
      info,
      time,
      username
    }
  }`;

  $.ajax({
    url: "/graphql",
    type: "get",
    data: {
      query,
      variables: JSON.stringify({ page: pageNow }),
    },
    success: getMessageBack,
    error: function() {
      bodyMessage("加载失败");
      $m.text("显示更多");
    },
  });
}

//点击具体的电影
function clickmovie(id) {
  $("#movielr")
    .css("display", "none")
    .stop()
    .fadeIn(500);
  if ($("#movieinfo_id").val() == id) return;
  const query = `
		query getMovieInfo($id:Int!){
			movieinfo(id:$id){
				id
				title
				type
				star
				mytalk
				info
				imgpath
				downlink
				downinfo
				movieimgs{
					imgpath
					ordernum
				}
			}
		}
	`;
  $.ajax({
    url: "/graphql",
    type: "GET",
    data: {
      query,
      variables: JSON.stringify({ id: id }),
    },
    success: getMovieInfoBack,
    error: function() {
      bodyMessage("获取电影信息失败");
    },
  });
  // $.ajax({
  //   url: 'main/todo.do',
  //   type: 'get',
  //   data: 'm=getMovieInfo&p=' + id,
  //   success: getMovieInfoBack,
  //   error: function() {
  //     bodyMessage('获取电影信息失败');
  //   },
  // });
}

/*-------------------------------- 各种回调函数  ----------------------------------*/

//留言模板
var messagehtml = '<div class="lit_userwords" style="display:none"><div class="lit_uw_w">@info@</div><div class="lit_uw_n l_font80 l_textright">@username@</div><div class="lit_uw_t l_font80 l_textright">@time@</div></div>';

//发表留言成功的回调函数
function putMessageBack(json) {
  if (!json.data || !json.data.createMessage) {
    return;
  }
  bodyMessage("留言成功");
  var str = messagehtml
    .replace(/@info@/g, json.data.createMessage.info)
    .replace(/@username@/g, json.data.createMessage.username)
    .replace(/@time@/g, dateStr2str(json.data.createMessage.time));
  $(str)
    .prependTo($("#lit_boxr"))
    .fadeIn(300);
  $("#lit_boxr").scrollTop(0);
  $("#lit_allwords").html("");
}

//获取留言列表的回调函数
function getMessageBack(json) {
  var a = $("#messageloadmore");
  $("#lit_boxr")
    .find(".iload")
    .remove();
  a.fadeIn(300);
  if (json.data.message.length > 0) {
    var e = "";

    for (var c = 0; c < json.data.message.length; c++) {
      e += messagehtml
        .replace(/@info@/g, json.data.message[c].info)
        .replace(/@username@/g, json.data.message[c].username)
        .replace(/@time@/g, dateStr2str(json.data.message[c].time));
    }
    $(e)
      .insertBefore(a)
      .fadeIn(300);
  }
  if (json.data.message.length < 5) {
    a.text("已全部加载完毕");
  } else {
    a.text("显示更多");
  }
}

function dateStr2str(datestr) {
  var d = new Date(Number(datestr));
  var month = d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
  var day = d.getDate() >= 10 ? d.getDate() : "0" + d.getDate();
  var hour = d.getHours() >= 10 ? d.getHours() : "0" + d.getHours();
  var minutes = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();
  var seconds = d.getSeconds() >= 10 ? d.getSeconds() : "0" + d.getSeconds();
  d = d.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;

  return d;
}

//电影列表模版
var moviehtml = "<img src='@img@' class='movecard l_imgback reflex itiltnone idistance5' onload='initCanvas(this)' onClick='clickmovie(@id@)'>";

//调用倒影插件的方法
function initCanvas(the) {
  if (isIE) {
    addIEReflex(the);
  } else {
    addReflex(the);
  }
  $(".iload", "#p2_movie").css("display", "none");
}

//获取电影列表的回调函数
function getMovieListBack(json) {
  var $m = $("#movie_more");

  if (json.data.rows.length < 15) {
    $m.css("display", "none");
  } else {
    $m.css("display", "inline-block");
  }
  if (json.data.rows.length <= 0) {
    //没有更多了
    $(".iload", "#p2_movie").css("display", "none");
  } else {
    var str = "";
    for (var i = 0; i < json.data.rows.length; i++) {
      str += moviehtml.replace(/@img@/g, baseip + json.data.rows[i].imgpath).replace(/@id@/g, json.data.rows[i].id);
    }

    $(str).insertBefore($m);
  }
  getMovieListA = 0;
}

//获取具体的电影信息
function getMovieInfoBack(json) {
  $("#movielr").mCustomScrollbar("scrollTo", "top", { scrollInertia: 0 });
  $("#movieinfo_id").val(json.data.movieinfo.id); //ID
  $("#movieinfo_img")
    .data("src", baseip + json.data.movieinfo.imgpath)
    .attr("src", "kernel/loadimg/wright.png")
    .addClass("load_img"); //封面图片
  $("#movieinfo_name").text(json.data.movieinfo.title); //电影名字
  $("#movieinfo_info").text(json.data.movieinfo.info); //电影简介
  $("#movieinfo_type").text(json.data.movieinfo.type); //类型

  var star = parseInt(json.data.movieinfo.star);
  var stars = "";
  for (var i = 0; i < star; i++) {
    stars += "★";
  }
  $("#movieinfo_star").text(stars); //星级
  $("#movieinfo_mytalk").text(json.data.movieinfo.mytalk); //我的评语
  $("#movieinfo_downlink")
    .attr("href", json.data.movieinfo.downlink)
    .text(json.data.movieinfo.downinfo);

  var imghtml = '<img class="movieinfo_photo l_imgback load_img" data-src="@imgpath@" src="kernel/loadimg/wright.png" />';
  var str = "";
  for (var i = 0; i < json.data.movieinfo.movieimgs.length; i++) {
    str += imghtml.replace(/@imgpath@/g, baseip + json.data.movieinfo.movieimgs[i].imgpath);
  }
  $("#movieinfo_jz").html('<span class="movieinfo_span1">剧照：</span><br/>' + str);

  setTimeout(function() {
    $(".load_img", "#movielr").LoadImage();
  }, 16);
}

//加载全部游戏列表回调函数
function getGameListBack(json) {
  var thehtml = '<div class="game_i articlelist articlelist_media l_cursor opacitytran" style="background-image:url(@imgpath@)" onClick="gameOpen(@id@)"><div class="article_info1"><span class="ar_info1">@name@</span></div></div>';
  var str = "";
  for (var i = 0; i < json.data.game.length; i++) {
    str += thehtml
      .replace(/@id@/g, json.data.game[i].id)
      .replace(/@name@/g, json.data.game[i].name)
      .replace(/@imgpath@/g, baseip + json.data.game[i].imgpath);
  }

  $(".iload", "#p2_game").css("display", "none");
  $(str).insertBefore($("#gamebox_t"));
  $("#gamebox").animate({ opacity: "1" }, 300);
  getGameListA = 0;
}

//点击游戏列表，打开游戏详细div
function gameOpen(id) {
  var $youxi = $("#youxi");

  $youxi.animate({ left: "0" }, 300);

  if ($("#yx_id").val() == id) {
    $("#youxi_1").animate({ "margin-top": "0", opacity: "1" }, 300);
    $("#youxi_2")
      .delay(150)
      .animate({ "margin-top": "0", opacity: "1" }, 300);
    $("#youxi_3")
      .delay(300)
      .animate({ "margin-top": "0", opacity: "1" }, 300);
    return;
  }

  $(".iload", "#youxi").css("display", "block");

  const query = `query getGameInfo($id: Int!){
    gameinfo(id: $id){
      id
      name
      type
      imgpath
      star
      info
      mytalk
      downlink
      downinfo
      howbig
      deploy
      gameimgs{
        imgpath
        ordernum
      }
    }
  }`;

  $.ajax({
    url: "/graphql",
    type: "get",
    data: {
      query,
      variables: JSON.stringify({ id: id }),
    },
    success: gameOpenBack,
    error: function() {
      bodyMessage("获取游戏信息失败");
    },
  });
  // $.ajax({
  //   url: 'main/todo.do',
  //   type: 'get',
  //   data: 'm=gameOpen&p=' + id,
  //   success: gameOpenBack,
  //   error: function() {
  //     bodyMessage('获取游戏信息失败');
  //   },
  // });
}

//详细游戏信息回调函数
function gameOpenBack(json) {
  $("#yx_id").val(json.data.gameinfo.id);
  $("#youxi_1")
    .css("background-image", "url(" + baseip + json.data.gameinfo.imgpath + ")")
    .text(json.data.gameinfo.name);
  $("#yx_name").text(json.data.gameinfo.name);
  $("#yx_type").text(json.data.gameinfo.type);

  var star = parseInt(json.data.gameinfo.star);
  var stars = "";
  for (var i = 0; i < star; i++) {
    stars += "★";
  }

  $("#yx_star").text(stars);
  $("#yx_howbig").text(json.data.gameinfo.howbig);
  $("#yx_pz").text(json.data.gameinfo.deploy);
  $("#yx_down")
    .attr("href", json.data.gameinfo.downlink)
    .text(json.data.gameinfo.downinfo);
  $("#yx_info").text(json.data.gameinfo.info);
  $("#yx_mytalk").text(json.data.gameinfo.mytalk);

  var imghtml = '<img src="kernel/loadimg/wright.png" data-src="@img@" class="y3_img load_img"/>';
  var str = "";
  for (var i = 0; i < json.data.gameinfo.gameimgs.length; i++) {
    str += imghtml.replace(/@img@/g, baseip + json.data.gameinfo.gameimgs[i].imgpath);
  }

  $("#yx_imgs").html(str);

  $("#youxi_1").animate({ "margin-top": "0", opacity: "1" }, 300);
  $("#youxi_2")
    .delay(150)
    .animate({ "margin-top": "0", opacity: "1" }, 300);
  $("#youxi_3")
    .delay(300)
    .animate({ "margin-top": "0", opacity: "1" }, 300);

  $(".iload", "#youxi").css("display", "none");

  setTimeout(function() {
    $(".load_img", "#youxi").LoadImage();
  }, 16);
}

//加载全部文章列表回调函数
function getArticleListBack(json) {
  var ahtml = '<div class="articlelist articlelist_media l_cursor opacitytran" style="background-image:url(@imgpath@)" onClick="wenzhangOpen(@id@)"><div class="article_info1"><span class="ar_info1">@title@</span><span class="ar_info2">作者：@aur@</span></div></div>';
  var str = "";
  for (var i = 0; i < json.data.article.length; i++) {
    str += ahtml
      .replace(/@id@/g, json.data.article[i].id)
      .replace(/@title@/g, json.data.article[i].title)
      .replace(/@aur@/g, json.data.article[i].author)
      .replace(/@imgpath@/g, baseip + json.data.article[i].imgpath);
  }

  $(".iload", "#p2_article").css("display", "none");
  $(str).insertBefore($("#article_t"));
  $("#articlebox").animate({ opacity: "1" }, 300);
  getArticleListA = 0;
}

//点击文章列表，打开文章详细div
function wenzhangOpen(id) {
  var $wenzhang = $("#wenzhang");

  $wenzhang.css("display", "block").animate({ width: "100%", left: "0" }, 300, function() {
    $wenzhang.animate({ height: "100%", top: "0" }, 500);
  });

  if (id == $("#wenzhangid").val()) {
    $("#wenzhangl,#wenzhangr").fadeIn(300);
    return;
  }

  $(".iload", "#wenzhang").css("display", "block");

  const query = `query getArticle($id: Int!){
    articleinfo(id:$id){
      id
      articlebody
      imgpath
      author
      intr
      photo
      title
    }
  }`;
  $.ajax({
    url: "/graphql",
    type: "get",
    data: {
      query,
      variables: JSON.stringify({ id: id }),
    },
    success: getOneArticleBack,
    error: function() {
      bodyMessage("获取文章信息失败");
    },
  });
  // $.ajax({
  //   url: 'main/todo.do',
  //   type: 'get',
  //   data: 'm=getOneArticle&p=' + id,
  //   success: getOneArticleBack,
  //   error: function() {
  //     bodyMessage('获取文章信息失败');
  //   },
  // });
}

//获取详细文章信息回调函数
function getOneArticleBack(json) {
  $("#wenzhangid").val(json.data.articleinfo.id);
  $("#w_title").text(json.data.articleinfo.title);
  $("#w_autor").text("————" + json.data.articleinfo.author);
  $("#w_body").html(json.data.articleinfo.articlebody);
  $("#wenzhang_photo").attr("src", baseip + json.data.articleinfo.photo);
  $("#w_autor2").text(json.data.articleinfo.author);
  $("#w_autorinfo").text(json.data.articleinfo.intr);
  $("#w_img").attr("src", baseip + json.data.articleinfo.imgpath);

  $(".iload", "#wenzhang").css("display", "none");
  $("#wenzhangl,#wenzhangr").fadeIn(300);
}

//获取第3页我的工作列表
function getAllWorks() {
  const query = `
    query {
      work{
        id
        imgpath
        title
        titleinfo
      }
    }
  `;
  $.ajax({
    url: "/graphql",
    type: "get",
    data: {
      query,
    },
    success: getAllWorksBack,
    error: function() {
      setTimeout("getAllWorks()", 50000); //如果获取失败，5S后重新获取
    },
  });
  // $.ajax({
  //   url: 'main/todo.do',
  //   type: 'get',
  //   data: 'm=getAllWorks&p=',
  //   success: getAllWorksBack,
  //   error: function() {
  //     setTimeout('getAllWorks()', 100000); //如果获取失败，10S后重新获取
  //   },
  // });
}
//获取第3页我的工作列表回调函数
function getAllWorksBack(json) {
  var bigimg = '<div id="bigimg_@num@" class="p3_bigimg opacitytran l_cursor" data-num="@num@" onClick="openWork(event,@id@)" style="background-image:url(@imgpath@)"></div>';
  var bigword = '<div id="bigword_@num@" class="p3_word p3_word_media l_nowarp l_cursor" onClick="openWork(event,@id@)" >@titleinfo@</div>';
  var bigbtn = '<div id="bigbtn_@num@" class="p3_banner p3_baner_media l_cursor" onClick="gotoTheP3Img(@num@)">@title@</div>';

  var str1 = "";
  var str2 = "";
  var str3 = "";
  var j = 1;
  for (var i = 0; i < json.data.work.length; i++) {
    str1 += bigimg
      .replace(/@num@/g, j)
      .replace(/@id@/g, json.data.work[i].id)
      .replace(/@imgpath@/g, baseip + json.data.work[i].imgpath);
    str2 += bigword
      .replace(/@num@/g, j)
      .replace(/@titleinfo@/g, json.data.work[i].titleinfo)
      .replace(/@id@/g, json.data.work[i].id);
    str3 += bigbtn.replace(/@num@/g, j).replace(/@title@/g, json.data.work[i].title);
    j++;
  }
  $("#page3_bigimg").append($(str1));
  $("#page3_word").append($(str2));
  $("#p3_t").before($(str3));

  setTimeout("initMyWorkList()", 16);
}

//初始化工作列表
function initMyWorkList() {
  $("#bigimg_1", "#page3_bigimg")
    .addClass("p3thisone")
    .css("top", "0");
  $("#bigword_1", "#page3_word")
    .addClass("p3thisword")
    .css("top", "0");
  $("#bigbtn_1", "#page3_list").addClass("bigbtncolor");
}

//打开具体的work页
function openWork(e, id) {
  var x = e.pageX;
  var y = e.pageY;
  $("#mywork")
    .css({ top: y + "px", left: x + "px", display: "block" })
    .stop()
    .animate({ top: "0", left: "0", width: "100%", height: "100%" }, 500);

  if ($("#mywork_t").val() == id) {
    $("#myworkbox").fadeIn(300);
    return;
  }

  $(".iload", "#mywork").css("display", "block");

  const query = `query getWorkInfo($id: Int!){
    workinfo(id:$id){
      mywork_id
      imgpath
      info
      ordernum
    }
  }`;
  $.ajax({
    url: "/graphql",
    type: "get",
    data: {
      query,
      variables: JSON.stringify({ id }),
    },
    success: openWorkBack,
    error: function() {
      bodyMessage("获取信息失败");
    },
  });
  // $.ajax({
  //   url: 'main/todo.do',
  //   type: 'get',
  //   data: 'm=getOneMyWork&p=' + id,
  //   success: openWorkBack,
  //   error: function() {
  //     bodyMessage('获取信息失败');
  //   },
  // });
}

function openWorkBack(json) {
  var img = '<img src="kernel/loadimg/wright.png" data-src="@imgpath@" class="mywork_info1 load_img"/>';
  var div = '<div class="mywork_info2">@info@</div>';

  var str = "";
  for (var i = 0; i < json.data.workinfo.length; i++) {
    if (json.data.workinfo[i].imgpath) {
      //有图片的显示图片
      str += img.replace(/@imgpath@/g, baseip + json.data.workinfo[i].imgpath);
    } else {
      //否则显示文字
      str += div.replace(/@info@/g, json.data.workinfo[i].info);
    }
  }
  $("#myworkbox").html(str);
  $("#mywork_t").val(json.data.workinfo[0].mywork_id);
  $(".iload", "#mywork").css("display", "none");
  $("#myworkbox").fadeIn(300);

  setTimeout(function() {
    $(".load_img", "#myworkbox").LoadImage();
  }, 16);
}
