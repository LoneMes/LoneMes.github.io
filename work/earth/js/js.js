/* 加了防盗 */
/* 全局变量 */
var canvas;			//canvas元素
var scene;			//场景
var camera;			//相机
var renderer;		//渲染器
var orbit;			//相机控制器
var clock;			//时间流逝
var composer;		//通道渲染器
var camera_p = {x:0,y:0,z:0,lx:0,ly:0,lz:0,light2i:3};	//相机相关属性
var readynum = 0;	//全部加载完了再出现画面
var $body = $("body");
var $window = $(window);
var light2;			//平行光
var orbitok = 0;	//是否开启鼠标控制器

window.onload = function(){
	"use strict";
	if (!Detector.webgl) {
		$(".boss").css("display","none");
		$(".loadingbox>div").text("您古董级的浏览器不支持WebGL");
		return;
	}else{
		CanvasInit();
		initSkyBox();
		initEarth();
		initLight();
		initCloud();
		
		
		lizi();
		thesun();
		fullLight();
		camera.lookAt(obj_earth.position);
		render();
	}
	
	//分辨率改变时，调整canvas渲染比例和大小
	$(window).on("resize",function(){
		camera.setViewOffset($window.width(),$window.height(),0,0,$window.width(),$window.height());
		renderer.setSize($window.width(),$window.height());
	});
}

/* 开始显示页面 */
function pageStart(){
	setTimeout(function(){show1()},2000);
}

/* 初始化 */
function CanvasInit(){
	//场景
	scene = new THREE.Scene();
	//相机
	camera = new THREE.PerspectiveCamera(45,$window.width() / $window.height() , 0.1, 3000);
	
	camera.lookAt(new THREE.Vector3(0,0,0));
	//渲染器
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setSize($window.width(),$window.height());
	renderer.setClearColor(new THREE.Color(0x000000, 1.0));
	renderer.autoClear = false;
	if(window.location.host.indexOf("luo")<0){return;}
	
	//THREE.js中的时间滴答
	clock = new THREE.Clock();
	
	//相机控制器
	orbit = new THREE.OrbitControls(camera);
	orbit.enabled = false;
	camera.position.set(0,0,120);
	//帧率指示器
	//stats = initStats();
	//辅助坐标系
	//var axes = new THREE.AxisHelper(1000);
	//scene.add(axes);
	//添加环境光
	//var light1 = new THREE.AmbientLight(0xaaaaaa);
	//scene.add(light1);
	//添加平行光
	light2 = new THREE.DirectionalLight(0xffffff,3);
	light2.position.set(-1000,300,0);

	scene.add(light2);

	//将渲染器添加进页面中
	$("#canvas").append(renderer.domElement);
}

/*======================== 动画循环======================== */
function render(){
	//stats.update();
	
	var delta = clock.getDelta();
	if(orbitok){orbit.update(delta);}
	obj_cloud.rotation.y +=0.001;
	obj_earth.rotation.y +=0.0007;
	obj_earthlight.rotation.y += 0.0007;
	
	TWEEN.update();
	//renderer.render(scene, camera);

	composer.render(delta);

	requestAnimationFrame(render);
}

/*function test(){
		var a = new THREE.BoxGeometry(5,5,5);
		var b = new THREE.MeshPhongMaterial();
		var c = new THREE.Mesh(a,b);
		scene.add(c);
}*/

/* 初始化帧率指示器 */
function initStats() {

	var stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.getElementById("stats").appendChild(stats.domElement);

	return stats;
}

/* 生成天空盒 */
function initSkyBox(){
	if(window.location.host.indexOf("luo")<0){return;}
	var urls = ["img/skybox/posx.jpg","img/skybox/negx.jpg",
	"img/skybox/posy.jpg","img/skybox/negy.jpg",
	"img/skybox/posz.jpg","img/skybox/negz.jpg"];
	var loader = new THREE.CubeTextureLoader();

	var textureCube = loader.load(urls);	//这是采用同步的方式，也可以异步
	
	var shader = THREE.ShaderLib["cube"];
	shader.uniforms["tCube"].value = textureCube;
	var material = new THREE.ShaderMaterial({
		fragmentShader:shader.fragmentShader,
		vertexShader:shader.vertexShader,
		uniforms:shader.uniforms,
		depthWrite:false,
		side:THREE.BackSide
	});
	c = new THREE.Mesh(new THREE.BoxGeometry(800,800,800),material);
	scene.add(c);
	readynum+=6;
	isReady();
}

/* 创建地球 */
var obj_earth;
function initEarth(){
	if(window.location.host.indexOf("isl")<0){return;}
	var a = new THREE.SphereGeometry(20,80,80);	
	var b = new THREE.MeshPhongMaterial();
	
	var url1 = "img/earth_earth.jpg";
	var url2 = "img/earth_normal.jpg";
	if(!pc()){
		url2 = "img/p/p_normal.jpg";
	}
	
	var loader = new THREE.TextureLoader();
	var loader2 = new THREE.TextureLoader();
	
	var texture = loader.load(url1);
	
	var texture2 = loader2.load(url2);
	
	b.map = texture;
	b.normalMap = texture2;		//将第2张图设为normalMap
	b.normalScale.set(1,1);		//法向量参数，最好设成一样的值，达到最佳效果
	var c = new THREE.Mesh(a,b);
	obj_earth = c;
	scene.add(c);
	readynum+=2;
	isReady();
}

/* 创建云层 */
var obj_cloud;
function initCloud(){
	var a = new THREE.SphereGeometry(20.2,80,80);	
	var b = new THREE.MeshPhongMaterial({transparent:true,blending:2,opacity:1});
	
	var url = "img/earth_clouds.jpg";
	if(!pc()){
		url = "img/p/p_clouds.jpg";
	}
	
	var loader = new THREE.TextureLoader();
	var texture = loader.load(url);

	b.map = texture;
	var c = new THREE.Mesh(a,b);
	obj_cloud = c;
	scene.add(c);
	readynum++;
	isReady();
}

/* 创建地球上的灯光 */
var obj_earthlight;
function initLight(){
	if(window.location.host.indexOf("isl")<0){return;}
	var loader = new THREE.TextureLoader();
	var url = "img/earth_light.jpg";
	if(!pc()){
		url = "img/p/p_light.jpg";
	}
	var texture = loader.load(url);
	var a = new THREE.SphereGeometry(20.1,80,80);
	var b = new THREE.MeshBasicMaterial({transparent:true,blending:2,opacity:1});
	b.map = texture;
	var c = new THREE.Mesh(a,b);
	obj_earthlight = c;
	scene.add(c);
	readynum++;
	isReady();
}

/* 全屏泛光 */
function fullLight(){
	var renderPass = new THREE.RenderPass(scene,camera);
	var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
	effectCopy.renderToScreen = true;
	
	var bloomPass = new THREE.BloomPass(3.5, 18, 6.0, 216);//光亮和模糊程度,投影的偏移位置,投影融合程度,泛光精细程度

	composer = new THREE.EffectComposer(renderer,new THREE.WebGLRenderTarget($window.width(), $window.height()));
	composer.addPass(renderPass);
	composer.addPass(bloomPass);
	composer.addPass(effectCopy);
}

/* 创建粒子系统 */
var obj_lizi;
function lizi(){
	var a = new THREE.Geometry();
	var b = new THREE.PointsMaterial({
		color:0xffffff,
		size:1,
		depthWrite:false,
		transparent:true,
		blending:2,		//融合模式，THREE.AdditiveBlending == 2
		map:lizi_b(),		//用上面的纹理加载到粒子上
		sizeAttenuation:true,
		vertexColors:true
	});
	
	for(var i=0;i<5000;i++){
		//设置随机坐标
		var point = new THREE.Vector3((Math.random()<=0.5?-1:1)*(Math.random()*(500-100)+100)*Math.sin(Math.random()*360),(Math.random()<=0.5?-1:1)*(Math.random()*(500-100)+100)*Math.sin(Math.random()*360),(Math.random()<=0.5?-1:1)*(Math.random()*(500-100)+100)*Math.sin(Math.random()*360));
		a.vertices.push(point);
		
		var color = new THREE.Color(0xffffff);	//创建颜色
		//随机颜色的明度，使创建的星星明暗不一
		color.setHSL(color.getHSL().h,color.getHSL().s,Math.random()*color.getHSL().l);
		a.colors.push(color);//上面材质中vertexColors设置为true，此处才有用
	}
	
	var c = new THREE.Points(a,b);
	obj_lizi = c;
	scene.add(c);
}

/* 粒子系统的纹理 */
function lizi_b(){
	var canvas = document.createElement('canvas');
	canvas.width = 16;
	canvas.height = 16;
	var pen = canvas.getContext('2d');
	var gradient = pen.createRadialGradient(	//放射状渐变色
		canvas.width/2,canvas.height/2,0,canvas.width/2,canvas.height/2,canvas.width/2
	);
	gradient.addColorStop(0,'rgba(255,255,255,1)');
	gradient.addColorStop(0.2,'rgba(255,200,200,1)');
	gradient.addColorStop(0.4,'rgba(255,255,255,1)');
	gradient.addColorStop(1,'rgba(0,0,0,1)');
	pen.fillStyle = gradient;			//将笔触填充色设置为这个渐变放射状
	pen.fillRect(0,0,canvas.width,canvas.height);	//画矩形
	var texture = new THREE.Texture(canvas);	//生成贴图对象（参数是图片或canvas画布）
	texture.needsUpdate = true;			//将这个对象缓存到GPU
	return texture;
}


var tween1;
var tween2;

//查看对象所有属性
/*function allPrpos(obj){
  var props = "" ; 
  for(var p in obj){
	props += p+":"+obj[p]+"\r\n"; 
  } 
  alert(props);
}*/

//创建太阳（镜头眩光）
function thesun(){
	var loader0 = new THREE.TextureLoader();
	loader0.load('img/lensflare/lensflare0.png',function(textureFlare0) {
		var flareColor = new THREE.Color(0xffffff);
		var lensFlare = new THREE.LensFlare(textureFlare0, 350, 0, THREE.AdditiveBlending, flareColor);
		var loader = new THREE.TextureLoader();
		loader.load('img/lensflare/hexangle.png',function(textureFlare1) {
			lensFlare.add(textureFlare1, 160, 0.3, THREE.AdditiveBlending);//大小，距离光源的远近
			lensFlare.add(textureFlare1, 70, 0.35, THREE.AdditiveBlending);
			lensFlare.add(textureFlare1, 200, 0.5, THREE.AdditiveBlending);
			lensFlare.add(textureFlare1, 70, 0.6, THREE.AdditiveBlending);
			lensFlare.add(textureFlare1, 50, 0.8, THREE.AdditiveBlending);
		
			lensFlare.position.set(-2000,300,0);
			scene.add(lensFlare);
			readynum++;
			isReady();
		});
	});
}

//判断所需图片是否全部加载完毕
function isReady(){
	$("#point").text(parseInt(readynum*100/11));
	if(readynum >= 11){
		pageStart();	
	}
}

//第1段动画
var $info1 = $(".info1");
var $info2 = $(".info2");
var $info3 = $(".info3");
var $info4 = $(".info4");
var $info5 = $(".info5");
var $info6 = $(".info6");
var $info7 = $(".info7");
var $info8 = $(".info8");
var $line1 = $(".line1");
var $btn1 = $(".btnbox1");
function show1(){
	$(".info0").fadeOut(300);
	$info1.css({"left":"52%"}).animate({"left":"50%","opacity":"show"},{duration:600,easing:"easeOutQuint"});
	$info2.css({"left":"48%"}).animate({"left":"50%","opacity":"show"},{duration:600,easing:"easeOutQuint",complete:function(){
		$info1.delay(200).animate({"left":"48%","opacity":"hide"},{duration:600,easing:"easeOutQuint"});
		$info2.delay(200).animate({"left":"52%","opacity":"hide"},{duration:600,easing:"easeOutQuint"});
	}});
	$info3.css({"left":"52%"}).delay(1000).animate({"left":"50%","opacity":"show"},{duration:600,easing:"easeOutQuint"});
	
	$info4.css({"left":"48%"}).delay(1000).animate({"left":"50%","opacity":"show"},{duration:600,easing:"easeOutQuint",complete:function(){
		$info3.delay(200).animate({"left":"48%","opacity":"hide"},{duration:600,easing:"easeOutQuint"});
		$info4.delay(200).animate({"left":"52%","opacity":"hide"},{duration:600,easing:"easeOutQuint",complete:function(){
			show1_1();	
		}});
		$(".loadingbox").delay(1500).fadeOut(1500,function(){$(".loadingbox").remove();});
	}});
}

function show1_1(){
	$(".redpoint").remove();
	$(".line1").animate({"width":"300px","margin-left":"-150px"},300);
	$(".line1").delay(200).animate({"height":"5px"},300);
	$info5.delay(200).animate({"height":"40px","margin-top":"-50px"},{duration:700,easing:"easeOutQuint"});
	$info6.delay(300).animate({"margin-top":"20px","opacity":"show"},700);
	$info7.delay(450).animate({"margin-top":"120px","opacity":"show"},700);
	$info8.delay(600).animate({"margin-top":"220px","opacity":"show"},700);
	$btn1.delay(750).animate({"margin-top":"270px","opacity":"show"},700);
}

//第2段动画
var show2ing = 0;
function show2(){
	if(show2ing){return;}
	show2ing = 1;
	$btn1.fadeOut(300);
	$info8.delay(100).fadeOut(300);
	$info7.delay(200).fadeOut(300);
	$info6.delay(300).fadeOut(300);
	$info5.delay(400).fadeOut(300);
	$line1.delay(400).fadeOut(300);
	show2_1();
}

function show2_1(){
	camera_p.x = camera.position.x;
	camera_p.y = camera.position.y;
	camera_p.z = camera.position.z;
	show2_1_back();
}

function show2_1_back(){
	tween1 = new TWEEN.Tween(camera_p).to({x:-42,y:0,z:-5,lz:20,light2i:1},2000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(theback).onComplete(function(){
			show2_2();
	});
	tween1.start();
}
//unicode转换
function hexToDec(str){
    str=str.replace(/\\/g,"%");
    return unescape(str);
}

//回调函数，在这个函数里改变你想要改变的对象的值
function theback(){
	var x = this.x;
	var y = this.y;
	var z = this.z;
	var lz = this.lz;
	var light2i = this.light2i;
	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
	light2.intensity = light2i;
	camera.lookAt(new THREE.Vector3(0,0,lz));
}

var $info9 = $(".info9");
var $info10 = $(".info10");
var $info11 = $(".info11");
var $info12 = $(".info12");
var $info13 = $(".info13");
var $btn2 = $(".btnbox2");
//第2段动画 - 文字出现
function show2_2(){
	$(".show2").css("display","block");
	$info9.animate({"opacity":"show","height":"70px","margin-top":"-45px"},300,function(){
		$info9.children("div").animate({"opacity":"show","margin-left":"0"},300);	
	});
	$info10.delay(100).animate({"opacity":"show","height":"60px","margin-top":"-20px"},300,function(){
		$info10.children("div").animate({"opacity":"show","margin-left":"0"},600);	
	});
	$info11.delay(300).animate({"opacity":"show","height":"60px","margin-top":"-20px"},300,function(){
		$info11.children("div").animate({"opacity":"show","margin-left":"0"},600);
	});
	$info12.delay(500).animate({"opacity":"show","height":"60px","margin-top":"-20px"},300,function(){
		$info12.children("div").animate({"opacity":"show","margin-left":"0"},600);	
	});
	$info13.delay(700).animate({"opacity":"show","height":"60px","margin-top":"-20px"},300,function(){
		$info13.children("div").animate({"opacity":"show","margin-left":"-100px"},600);	
	});
}

//第3段动画
function show3(){
	$(".show2").fadeOut(300);
	tween1 = new TWEEN.Tween(camera_p).to({x:-80,y:0,z:-80,lz:0,light2i:.7},2000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(theback).onComplete(function(){
			$(".logo,.footer").fadeIn(200);
			$(".btnbox3").delay(100).animate({"margin-bottom":"20px","opacity":"show"},300);
			$(".msg").animate({"margin-bottom":"70px","opacity":"show"},300);
			orbit.enabled = true;
			orbitok = 1;
			
			setTimeout(function(){
					$(".msg").fadeOut(300);
			},3000);
	});
	tween1.start();
}

/* 判断是移动端还是PC端 */
function pc() {
	if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		return false;
	}
	else {
		return true;
	}
}


