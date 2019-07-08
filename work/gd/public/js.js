(function($) {
  'use strict';
  var base = 'https://isluo.com/work/gd'; // 基础访问地址
  var canvas = document.getElementById('canvas1'); // 第1页canvas对象
  var ctx = canvas.getContext('2d'); // 第1页canvas上下文
  ctx.mozImageSmoothingEnabled = false;
  var w_w = window.innerWidth; // 工作区实时宽度
  var w_h = window.innerHeight; // 工作区实时高度
  var imgOk = 0; // 标识所有图片资源是否加载完毕
  var imgAll = 10; // 目前需要预加载的图片总数
  var canvasHD = 1; // 屏幕像素密度/canvas像素密度 比值
  var isMac = navigator.userAgent.indexOf('Mac OS') > -1; // ios终端
  var isIpad = navigator.userAgent.indexOf('iPad') > -1;
  var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1; //android终端
  var isMobile = true; // 是否是移动端
  var audio1 = document.getElementById('audio1');
  var musicnow = 1; // 当前正在播放的音乐序号
  var modalnow = 1; // 当前加载的是哪个详细页面
  var imgobjs = {
    s1: null, // lily人像
    s2: null, // lily背景
    s3: null, // lily前景
    s4: null, // lily叶子1
    s5: null, // lily叶子2
    s6: null, // lily叶子3
    p1: null, // princess人像
    p2: null, // princess背景
    p3: null, // princess灯笼1
    p4: null, // princess灯笼2
  }; // 保存所有图片资源的对象
  var yza1 = []; // lily 叶子数组1
  var yza2 = []; // lily 叶子数组2
  var dla1 = []; // 灯笼数组1
  var dla2 = []; // 灯笼数组2
  var dla3 = []; // 灯笼数组3

  window.onload = function() {
    FastClick.attach(document.body);
    // 获取像素密度比，防止在高清屏上模糊，比如IOS
    canvasHD = CanvalHD(ctx);
    isMobile = checkMobile(); // 判断是否是移动端
    if (!isMobile) {
      // 如果不是移动端，则初始化滚动条美化插件
      $('#modal').mCustomScrollbar({
        autoHideScrollbar: true,
        theme: 'minimal',
        mouseWheelPixels: 400,
      });
    }

    // 阻止拖拽图片
    $('#canvas1,img')
      .on('contextmenu', function(event) {
        event.preventDefault();
      })
      .attr('draggable', 'false');
    // 监听窗口大小变化
    $(window)
      .on('resize', function() {
        //自适应字体大小设置
        var boss = document.getElementById('boss');
        w_w = boss.offsetWidth; // body的宽度，即使出现纵向滚动条也不会有问题
        w_h = boss.offsetHeight; // body的高度
        canvasChange(w_w * canvasHD, w_h * canvasHD); // 更新canvas
      })
      .resize();
    // 绑定是否开启音乐按钮的事件
    $('#foundbtn1').on('touchend', function() {
      // 开启音乐
      playMusic();
      initDown();
    });
    $('#foundbtn2').on('touchend', function() {
      // 关闭音乐
      initDown();
    });

    // 绑定点击body时 初始化一些东西
    $('#boss').on('click', function() {
      // 隐藏菜单
      var $box = $('#menubox');
      $box.removeClass('show');
      setTimeout(function() {
        $box.css('display', 'none');
      }, 300);
    });
    // 绑定菜单各事件
    $('#menubtn').on('click', function(e) {
      stopPao(e);
      var $box = $('#menubox');
      if ($box.hasClass('show')) {
        // 已经出现了，需要隐藏
        $box.removeClass('show');
        setTimeout(function() {
          $box.css('display', 'none');
        }, 300);
      } else {
        // 没有出现，现在要出现
        $box.css('display', 'block');
        setTimeout(function() {
          $box.addClass('show');
        }, 16);
      }
    });

    // 绑定选择音乐按钮的事件
    $('.bgmul .mp3').on('click', function(e) {
      stopPao(e);
      var $t = $(this);
      $('.bgmul .mp3').removeClass('play');
      $t.addClass('play');
      musicnow = $t.data('mp3');
      audio1.setAttribute('src', base + '/file/' + musicnow + '.mp3');
      audio1.play();
    });
    // 绑定音乐循环播放
    $('#audio1').on('ended', function() {
      musicnow++;
      if (musicnow > 2) {
        musicnow = 1;
      }
      $('.bgmul .mp3').removeClass('play');
      $(".bgmul .mp3[data-mp3='" + musicnow + "']").addClass('play');
      audio1.setAttribute('src', base + '/file/' + musicnow + '.mp3');
      audio1.play();
    });

    // 绑定modal按钮点击事件
    $('.menuul>li').on('click', function() {
      var $t = $(this);
      var now = $t.data('id');
      var $m = $('#modal');
      var $c = $('#close');

      if ($m.css('display') == 'block') {
        // 已经是出现状态，则需要播放切换动画
        if (now !== modalnow) {
          // 如果不一样，则播放切换动画
          modalLoadShow();
          $('#box')
            .stop()
            .fadeOut(200, function() {
              if (isMobile) {
                $m.scrollTop(0);
              } else {
                $m.mCustomScrollbar('scrollTo', 'top', { scrollInertia: 0 });
              }
              ajaxModal($t.data('id')); // 并开始加载相应的页面
            });
        }
      } else {
        // 原本是未出现状态，则直接初始化modal，不播放切换动画
        if (now !== modalnow) {
          $('#box').css('display', 'none');
          if (isMobile) {
            $m.scrollTop(0);
          } else {
            $m.mCustomScrollbar('scrollTo', 'top', { scrollInertia: 0 });
          }
          modalLoadShow();
          ajaxModal($t.data('id')); // 并开始加载相应的页面
        }
        $m.fadeIn(300);
        $c.animate({ opacity: 'show', bottom: '30px' }, 300);
      }
      modalnow = now;
    });
    // 绑定close modal事件
    $('#close').on('click', function() {
      $('#modal')
        .stop()
        .fadeOut(300);
      $(this).animate({ opacity: 'hide', bottom: '0' }, 300);
    });
    // 加载所有所需要的图片资源
    ajaxImgs();
  };

  // 加载所有需要的图片资源
  function ajaxImgs() {
    loadImg(base + '/img/saberlily_1.png', 's1', initOk);
    loadImg(base + '/img/saberlily_2.jpg', 's2', initOk);
    loadImg(base + '/img/saberlily_3.png', 's3', initOk);
    loadImg(base + '/img/yz1.png', 's4', initOk);
    loadImg(base + '/img/yz2.png', 's5', initOk);
    loadImg(base + '/img/yz3.png', 's6', initOk);
    loadImg(base + '/img/princess_1.png', 'p1', initOk);
    loadImg(base + '/img/princess_2.jpg', 'p2', initOk);
    loadImg(base + '/img/d2.png', 'p3', initOk);
    loadImg(base + '/img/d1.png', 'p4', initOk);
  }

  // 图片加载完成后触发此方法，用来判断是否初始化完成
  function initOk(obj) {
    if (obj.type) {
      imgOk++;
      imgobjs[obj.name] = obj;
      $('#loadingspan').text(((imgOk / imgAll) * 100).toFixed(0));
    }
    if (imgOk >= imgAll) {
      // 全部成功加载完毕，触发下一步
      // 判断是移动端还是PC端，移动端弹出是否开启音乐选择
      //initDown();
      $('.loadingdiv').addClass('fadeOut');
      if (isMobile) {
        $('.founddiv').css('display', 'block');
        $('.founddiv div').css('display', 'inline-block');
        setTimeout(function() {
          $('.founddiv div').addClass('fadeIn');
        }, 150);
      } else {
        playMusic(); // PC端直接开始播放音乐
        initDown();
      }
    }
  }

  // 所有初始化完毕 触发此方法
  function initDown() {
    $('.founddiv').addClass('fadeOut');
    $('#loading')
      .delay(150)
      .fadeOut(1500); // loading消失
    // 构造lily漂浮物对象第1层
    for (var i = 0; i < 30; i++) {
      var level = Math.random();
      if (i <= 5) {
        yza1.push({
          speedX: getRandom(30 * level + 10, 40 * level + 10), // X速度 level越大表示越靠前 速度应该越大
          speedY: getRandom(0 * level, 20 * level), // Y速度
          opacity: 1, // 透明度
          img: level < 0.7 ? imgobjs.s4.img : level < 0.85 ? imgobjs.s5.img : imgobjs.s6.img, // 是哪一张图片，共有3张叶子图片
          size: 0.8 + level * 0.7, // 图片的大小比例
          rotate: getRandom(0, 180), // 旋转角度
          now: [getRandom(0, canvas.width * 1.5), getRandom(canvas.height / 4, canvas.height)],
          type: level,
        });
      }
      yza2.push({
        speedX: getRandom(20 * level + 10, 30 * level + 10), // X速度
        speedY: getRandom(0 * level, 5 * level), // Y速度
        opacity: 0.2 + level * 0.7, // 透明度
        img: level < 0.5 ? imgobjs.s4.img : level < 0.75 ? imgobjs.s5.img : imgobjs.s6.img, // 是哪一张图片，共有3张叶子图片
        size: 0.2 + level * 0.5, // 图片的大小比例
        rotate: getRandom(0, 180), // 旋转角度
        now: [getRandom(0, canvas.width), getRandom(0, canvas.height * 1.5) - canvas.height * 0.5],
        type: level,
      });
    }

    // 构造公主漂浮物对象 第2层和第1层都有遮挡关系，先创建小的
    for (i = 0; i < 160; i++) {
      var level = Math.random();
      if (i == 1) {
        dla1.push({
          img: imgobjs.p4.img, // 是哪一张图片，共有2张灯笼图片
          now: [canvas.width * 2, 0],
          type: i,
        });
      }
      if (i <= 20) {
        dla2.push({
          speedX: 5 + i * 0.5, // X速度 level越大表示越靠前 速度应该越大
          speedY: 1.5 + i * 0.1, // Y速度
          opacity: i < 8 ? 0.05 * i + 0.65 : 1, // 透明度
          img: imgobjs.p4.img, // 是哪一张图片，共有2张灯笼图片
          size: 0.2 + i * 0.05, // 图片的大小比例
          now: [getRandom(0, canvas.width * 3) - canvas.width, getRandom(canvas.height * 0.5 + i * 2, canvas.height * 1.5)],
          type: i,
        });
      }
      dla3.push({
        img: level < 0.3 ? imgobjs.p3.img : imgobjs.p4.img, // 是哪一张图片，共有2张灯笼图片
        now: [0, 0],
        opacity: 0,
        maxOpacity: 0.5 + level * 0.5,
        lastX: -1,
      });
    }
    canvas1();
    logoShow();
  }

  // logo出现动画
  function logoShow() {
    $('#logo_d1').addClass('logof1');
    $('#logo_d2').addClass('logof2');
    $('#logo_word').addClass('logof3');
    $('#logow1').addClass('logofw1');
    $('#logow2').addClass('logofw2');
  }
  // canvas1动画播放器
  var aniSchedule = 1.265; // 最开始有130%大 减到105%大时开始切换 到100%时完全切换完毕
  var aniSchedule2 = 1.3;
  var start1 = true;
  var start2 = false;
  var glo = 0;
  var glo2 = 0;
  var zoom = isAndroid ? 0.5 : 1;
  function canvas1() {
    if (start1) {
      if (aniSchedule >= 1.28) {
        // 第1幅图淡入
        glo += 0.01;
      } else if (aniSchedule > 1.02 && aniSchedule < 1.28) {
        glo = 1;
      } else if (aniSchedule > 1 && aniSchedule <= 1.02) {
        // 第1幅图淡出
        glo -= 0.01;
        if (aniSchedule2 <= 1) {
          aniSchedule2 = 1.3;
        }
        start2 = true;
      } else {
        start1 = false;
        aniSchedule = 1.3;
        glo = 0;
      }
      play1(glo);
      aniSchedule -= 0.0002;
    }
    if (start2) {
      if (aniSchedule2 >= 1.28) {
        // 第2幅图淡入
        glo2 += 0.01;
      } else if (aniSchedule2 > 1.02 && aniSchedule2 < 1.28) {
        glo2 = 1;
      } else if (aniSchedule2 > 1 && aniSchedule2 <= 1.02) {
        // 第2幅图淡出
        glo2 -= 0.01;
        if (glo2 < 0) {
          glo2 = 0;
        }
        if (aniSchedule <= 1) {
          aniSchedule = 1.3;
        }
        start1 = true;
      } else {
        start2 = false;
        aniSchedule2 = 1.3;
        glo2 = 0;
      }
      play2(glo2);
      aniSchedule2 -= 0.0002;
    }
    requestAnimationFrame(canvas1);
  }

  // 第1幅图动画
  function play1(g) {
    ctx.globalAlpha = g; // 整体透明度
    // 根据工作区宽高计算背景位置和缩放大小
    var wh_pie = w_w / w_h; // 屏幕宽高比例
    var rate = aniSchedule; // 整体缩放比

    /*
			=======
		 	①、绘制背景
		  	=======
		*/

    var w; // 背景的宽
    var h; // 背景的高
    if (wh_pie > imgobjs.s2.pie) {
      // 说明屏幕比画更宽，高度更矮，所以需要画的宽度100%，画垂直居中
      // 当画的宽度为canvas宽度时，计算此时画的高度
      w = canvas.width * rate;
      h = w / imgobjs.s2.pie;
    } else {
      // 说明画的高度不够，需要把画的高度设为canvas的高度，然后左右居中
      // 绘制背景
      // 在这种比例下，背景的大小是由高度决定的，改变窗口宽度，只是改变背景的居中位置
      h = canvas.height * rate;
      w = h * imgobjs.s2.pie;
    }
    ctx.drawImage(imgobjs.s2.img, -(w - canvas.width) / 2, -(h - canvas.height) / 3, w, h);

    /*
			======
			②、绘制第2层的漂浮物 第2层普遍偏慢，偏小
			======
		*/
    yza2.forEach(function(v) {
      var level = getRandom(0, 1); // 越大表示越靠前，基础透明度范围越低，速度越快，基础大小范围越大
      if (v.now[0] < -50) {
        // 走到屏幕边缘外了，重置
        v.now[0] = canvas.width * 1.1;
        v.now[1] = getRandom(0, canvas.height * 1.5) - canvas.height * 0.5;
        v.speedX = getRandom(10 * level, 15 * level); // X速度
        v.speedY = getRandom(0 * level, 5 * level); // Y速度
        v.size = (0.2 + level * 0.7) * aniSchedule * zoom;
        v.opacity = 0.2 + level * 0.5; // 透明度
      } else {
        v.now[0] = v.now[0] - v.speedX;
        v.now[1] = v.now[1] + v.speedY;
      }
      v.rotate = v.type < 0.5 ? v.rotate - v.speedX / 8 : v.rotate + v.speedX / 8;
      ctx.save();
      ctx.translate(v.now[0], v.now[1]);
      ctx.rotate((v.rotate * Math.PI) / 180);
      ctx.drawImage(v.img, -(v.img.width * v.size) / 2, -(v.img.height * v.size) / 2, v.img.width * v.size, v.img.height * v.size);
      ctx.restore();
    });

    /*
			=====
			③绘制lily人像 人像比例和背景比例是固定的，知道了背景大小，就确定了人像大小
			现在是按照宽度确定的比例，在长度和宽度比一定数值后，比如在手机上，长度很长，宽度很窄，需要以高度来确定人像比例
			=====
		*/

    // 实时宽度 = canvas宽度 / (canvas宽度 / psd原图中人像原画宽度) 原画中约等于1.54 （1170宽时，图像是800宽）
    rate = aniSchedule;
    var s1_w;
    var s1_h;
    var s1_mx;
    var s1_my;
    if (wh_pie >= 1.2) {
      // 宽屏
      s1_w = (canvas.width / 1.7) * rate;
      s1_h = s1_w / imgobjs.s1.pie;
      s1_mx = -(s1_w - s1_w / rate) / 0.85;
      s1_my = h - s1_h + -(h - canvas.height) / 2;
    } else {
      // 窄屏
      s1_h = (canvas.height / 1.2) * rate;
      s1_w = s1_h * imgobjs.s1.pie;
      s1_mx = -(s1_w - s1_w / rate) / 2 - s1_w / 2.5;
      s1_my = h - s1_h + -(h - canvas.height) / 2;
    }
    // 计算人像的垂直偏移量,根据整体比例算的
    ctx.drawImage(imgobjs.s1.img, s1_mx, s1_my, s1_w, s1_h);

    /*
			=====
			④ 绘制第1层漂浮物 这一层普遍偏大，偏画面中下
			=====
		*/
    yza1.forEach(function(v) {
      var level = Math.random(); // 越大表示越靠前，基础透明度范围越低，速度越快，基础大小范围越大
      if (v.now[0] < -50) {
        // 走到屏幕边缘外了，重置
        v.speedX = getRandom(40 * level + 10, 50 * level + 10);
        v.speedY = getRandom(0 * level, 20 * level);
        v.now[0] = canvas.width * 1.1;
        v.now[1] = getRandom(canvas.height / 4, canvas.height);
        v.size = (0.8 + level * 0.7) * aniSchedule * zoom;
        v.rotate = level * 10;
        v.type = level;
      } else {
        v.now[0] = v.now[0] - v.speedX * 0.5;
        v.now[1] = v.now[1] + v.speedY * 0.5;
      }
      // 如果v.type的值小0.5 就逆时针转
      v.rotate = v.type < 0.5 ? v.rotate - v.type * 12 : v.rotate + v.type * 12;
      ctx.save();
      ctx.globalAlpha = v.opacity * g;
      ctx.translate(v.now[0], v.now[1]);
      ctx.rotate((v.rotate * Math.PI) / 180);
      ctx.drawImage(v.img, -(v.img.width * v.size) / 2, -(v.img.height * v.size) / 2, v.img.width * v.size, v.img.height * v.size);
      ctx.restore();
    });

    /*
			=====
			⑤ 绘制前景
			=====
		*/
    rate = (aniSchedule - 1) * 2.7 + 1;
    var w5;
    var h5;
    if (wh_pie >= 1.2) {
      // 宽屏
      w5 = canvas.width * rate;
      h5 = w5 / (imgobjs.s3.pie * 1.2);
    } else {
      // 窄屏
      h5 = (canvas.height / 1.7) * rate;
      w5 = h5 * imgobjs.s3.pie; // 总之与背景图一样宽
    }
    ctx.drawImage(imgobjs.s3.img, -(w5 - canvas.width) / 2, canvas.height - h5 + (h5 - h5 / rate) / 2 + 50, w5, h5);
  }

  // 第2幅图动画
  function play2(g) {
    ctx.globalAlpha = g; // 整体透明度

    // 根据工作区宽高计算背景位置和缩放大小
    var wh_pie = w_w / w_h; // 屏幕宽高比例
    var rate = aniSchedule2; // 整体缩放比

    /*
			=======
		 	①、绘制背景
		  	=======
		*/

    var w; // 背景的宽
    var h; // 背景的高
    if (wh_pie > imgobjs.p2.pie) {
      // 说明屏幕比画更宽，高度更矮，所以需要画的宽度100%，画垂直居中
      // 当画的宽度为canvas宽度时，计算此时画的高度
      w = canvas.width * rate;
      h = w / imgobjs.p2.pie;
    } else {
      // 说明画的高度不够，需要把画的高度设为canvas的高度，然后左右居中
      // 绘制背景
      // 在这种比例下，背景的大小是由高度决定的，改变窗口宽度，只是改变背景的居中位置
      h = canvas.height * rate;
      w = h * imgobjs.p2.pie;
    }
    var w_m = (w - canvas.width) / 2;
    var h_m = (h - canvas.height) / 2;
    ctx.drawImage(imgobjs.p2.img, -w_m, -h_m, w, h);

    /*
			======
			②、绘制第3层的漂浮物 第3层最小最慢
			======
		*/
    dla3.forEach(function(v) {
      var level = Math.random(); // 越大表示越靠前，基础透明度范围越低，速度越快，基础大小范围越大
      if (v.now[0] > v.lastX) {
        // 走到屏幕边缘外了，重置
        v.speedX = level * 0.6 + 0.05; //(0.1 + level * 1.2) * 0.5;
        v.speedY = level * 0.175 + 0.05; //(0.1 + level * 0.35) * 0.5;
        v.now[0] = getRandom(w / 3 - w_m, canvas.width);
        v.now[1] = getRandom(h / 1.5 - h_m, h);
        v.lastX = v.now[0] + 500; // 最终要移动到的X坐标
        v.size = (0.1 + level * 0.1) * zoom;
        v.opacity = 0;
        v.maxOpacity = level > 0.5 ? 1 : level * 0.5 + 0.5;
      } else {
        v.now[0] = v.now[0] + v.speedX;
        v.now[1] = v.now[1] - v.speedY;
      }

      ctx.save();
      if (v.lastX - v.now[0] > 400) {
        // 刚出现，透明度逐渐增加
        v.opacity += v.maxOpacity * 0.01;
        ctx.globalAlpha = v.opacity * g;
      } else if (v.lastX - v.now[0] < 100) {
        // 快结束了，透明度减小
        v.opacity -= v.maxOpacity * 0.01;
        if (v.opacity < 0) {
          v.opacity = 0;
        }
        ctx.globalAlpha = v.opacity * g;
      }
      ctx.drawImage(v.img, v.now[0], v.now[1], v.img.width * v.size, v.img.height * v.size);
      ctx.restore();
    });

    /*
			======
			②、绘制第2层的漂浮物 第2层偏小较快
			======
		*/

    dla2.forEach(function(v) {
      var level = Math.random(); // 越大表示越靠前，基础透明度范围越低，速度越快，基础大小范围越大
      if (v.now[0] > canvas.width * 1.2) {
        // 走到屏幕边缘外了，重置
        v.speedX = 5 + v.type * 0.5;
        v.speedY = 1.5 + v.type * 0.1;
        v.now[0] = -50;
        v.now[1] = getRandom(canvas.height / 2 + v.type * 2, canvas.height * 1.5);
        v.size = 0.2 + v.type * 0.05 * zoom;
      } else {
        v.now[0] = v.now[0] + v.speedX * 0.5;
        v.now[1] = v.now[1] - v.speedY * 0.5;
      }

      // 如果v.type的值小0.5 就逆时针转
      ctx.drawImage(v.img, v.now[0], v.now[1], v.img.width * v.size * aniSchedule2, v.img.height * v.size * aniSchedule2);
    });

    /*
			=====
			③绘制princess人像 人像比例和背景比例是固定的，知道了背景大小，就确定了人像大小
			现在是按照宽度确定的比例，在长度和宽度比一定数值后，比如在手机上，长度很长，宽度很窄，需要以高度来确定人像比例
			=====
		*/

    // 实时宽度 = canvas宽度 / (canvas宽度 / psd原图中人像原画宽度) 原画中约等于1.6 （1170宽时，图像是800宽）
    rate = aniSchedule2;
    var s1_w;
    var s1_h;
    var s1_mx;
    var s1_my;
    if (wh_pie >= 1.1) {
      // 宽屏
      s1_w = (canvas.width / 1.85) * rate;
      s1_h = s1_w / imgobjs.p1.pie;
      s1_mx = -(s1_w - s1_w / rate) / 0.85;
      s1_my = h - s1_h - (h - canvas.height) / 2;
    } else {
      // 窄屏
      s1_h = (canvas.height / 1.12) * rate;
      s1_w = s1_h * imgobjs.p1.pie;
      s1_mx = -(s1_w - s1_w / rate) / 2 - s1_w / 3;
      s1_my = h - s1_h + -(h - canvas.height) / 2;
    }
    // 计算人像的垂直偏移量,根据整体比例算的
    ctx.drawImage(imgobjs.p1.img, s1_mx, s1_my, s1_w, s1_h);

    /*
			=====
			④ 绘制第1层漂浮物 这一层普遍偏大，偏画面中下
			=====
		*/
    dla1.forEach(function(v) {
      var level = Math.random(); // 越大表示越靠前，基础透明度范围越低，速度越快，基础大小范围越大
      if (v.now[0] > canvas.width * 1.5) {
        // 走到屏幕边缘外了，重置
        v.speedX = getRandom(12 * level + 60, 10 * level + 80) + v.type * 10;
        v.speedY = getRandom(12 * level + 5, 12 * level + 15) + v.type * 5;
        v.now[0] = -getRandom(v.type * 20, canvas.width + v.type * 50);
        v.now[1] = getRandom(canvas.height, canvas.height * 1.5);
        v.size = (2.5 + level * 1.5 + v.type * 2) * zoom;
      } else {
        v.now[0] = v.now[0] + v.speedX * 0.5;
        v.now[1] = v.now[1] - v.speedY * 0.5;
      }
      ctx.drawImage(v.img, v.now[0], v.now[1], v.img.width * v.size * aniSchedule2, v.img.height * v.size * aniSchedule2);
    });
  }

  // 窗口大小变化时，更新canvas
  function canvasChange(w, h) {
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
  }

  // 异步加载图片 成功返回图片对象 和 true,否则返回null和false
  // 参数是图片完整路径,对应imgobjs中的key,回调函数
  function loadImg(src, name, callback) {
    var img = document.createElement('img');
    img.onload = function() {
      img.onload = null;
      callback({ img: img, name: name, type: true, pie: img.width / img.height });
    };
    img.onerror = function() {
      img = null;
      callback({ img: null, name: name, type: false, pie: 0 });
    };
    img.src = src;

    if (img.complete) {
      img.onload = null;
      callback({ img: img, name: name, type: true, pie: img.width / img.height });
    }
  }
  // 生成min ~ max之间的随机小数
  function getRandom(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  // 获取屏幕像素密度比
  function CanvalHD(ctx) {
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStorePixelRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
    console.log('是马上：', devicePixelRatio, backingStorePixelRatio, isAndroid || isIpad);
    if (isAndroid || isIpad || isMac) {
      return devicePixelRatio / backingStorePixelRatio;
    } else {
      return (devicePixelRatio / backingStorePixelRatio) * 2;
    }
  }

  // 判断是否是移动端，是则返回true,否则返回false
  function checkMobile() {
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      return true;
    }
    return false;
  }

  // 阻止事件冒泡
  function stopPao(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    } else {
      window.event.cancelBubble = true;
    }
  }

  // 播放器控制程序，不停的循环播放
  function playMusic() {
    audio1.play();
  }

  // ajax加载对应的详情页面
  function ajaxModal(id) {
    var page = {
      a: '/story.html',
      b: '/roles.html',
      c: '/painter.html',
    };
    // 先看缓存有没有
    var temp = window.localStorage.getItem('modal_' + id);
    if (temp) {
      $('#box')
        .html(temp)
        .fadeIn(300);
      modalLoadHide();
    } else {
      $.ajax({
        url: '/work/gd' + page[id],
        type: 'GET',
        success: function(msg) {
          modalLoadHide();
          $('#box')
            .html(msg)
            .fadeIn(300);
          // 缓存数据
          window.localStorage.setItem('modal_' + id, msg);
          console.log(msg);
        },
        error: function(msg) {
          modalLoadHide();
          console.log('加载失败');
        },
      });
    }
  }

  function modalLoadShow() {
    $('#modalloading')
      .stop()
      .fadeIn(200);
  }
  function modalLoadHide() {
    $('#modalloading')
      .stop()
      .fadeOut(200);
  }
})(jQuery);
