$(function() {  
    FastClick.attach(document.body);  
}); 

window.onload = function() {
	var scene;		// 场景对象
	var camera;		// 主摄像机
	var camera_info = {x:0,y:0,z:0,lz:0};// 保存相机相关位置，动画用
	var renderer;	// 渲染器对象
	var light0;		// 环境光
	var light1;		// 平行光
	var light2;		// 点光源
	var ocean;		// 海
	var controls;   // 鼠标控制器
	var cubes = []; // 所有的立方体
	var composer;	// 全屏泛光对象
	var $loading = $('#percent');	// loading百分比
	var percent = 0;// 加载百分比
	var pageChangeing = false;// 页面是否正在转换
	var playing = 0.1; // 音乐是否正在播放
	var audio = document.getElementById('audio');
	var isMobile = checkMobile();	// 是否是移动端
	var pageNow = 0; // 当前是哪一页

	if (!Detector.webgl) {
		$('#noway').fadeIn(200);
		$('#loading').fadeOut(200);
	    return;
	}

	$loading.text((percent += 10) + '%');

	init();			// 场景基本元素初始化
	// AxisHelper();// 坐标轴对象
	//controls = initOrbitControls();	// 轨道控制器
	createCustom();	// 创建形状
	createSprite();	// 创建平面
	initLight();	// 添加灯光
	fullLight();	// 全屏泛光

	/** 循环渲染 **/
	const clock = new THREE.Clock(true);	// 全局时间
	function render() {
		requestAnimationFrame( render );
		const time = clock.getDelta();
		for(var i=0; i<cubes.length; i++) {
			if (cubes[i].position.x > 100 || cubes[i].position.y < -50 || cubes[i].position.z > 100) {
				cubes[i].position.x = -Math.random() * 200;
				cubes[i].position.y = Math.random() * 200;
				cubes[i].position.z = -Math.random() * 200;
			} else if (time > 1) {
				cubes[i].position.x = cubes[i].myx;
				cubes[i].position.y = cubes[i].myy;
				cubes[i].position.z = cubes[i].myz;
			} else {
				cubes[i].position.x += time * 5 * playing;
				cubes[i].position.y -= time * 5 * playing;
				cubes[i].position.z += time * 2 * playing;
			}

			cubes[i].rotation.x += time + cubes[i].speed;
			cubes[i].rotation.y += time + cubes[i].speed;
		}

		camera.updateMatrixWorld();
		//controls.update();
		TWEEN.update();
		// renderer.render( scene, camera );
		composer.render(time);
	}
	render();

	function init() {
		window.addEventListener( 'resize', onWindowResize, false );

        scene = new THREE.Scene();
        // scene.fog = new THREE.Fog(0x000000, 0.015, 1000);
        camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 10;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.looktos = {x:0, y:0, z:0};
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvasbox').appendChild(renderer.domElement);
        $loading.text((percent += 10) + '%');

        // 绑定各事件
        $('#page1').on('click', function(){
			toPage({x:0,y:0,z:10,rx:0,ry:0,rz:0}, 0);
        });
        $('#page2').on('click', function(){
			toPage({x:0,y:10,z:-10,rx:-1,ry:10,rz:-15}, 1);
        });
        $('#page3').on('click', function(){
			toPage({x:-10,y:20,z:-10,rx:20,ry:5,rz:-30}, 2);
        });
        $('#audiobtn').on('click', function(){
        	if(playing === 1) {
        		$('.audiobtn img').removeClass('show');
        		$('.audiobtn .close').addClass('show');
        		audio.pause();
        		playing = 0.1;
        	} else {
        		$('.audiobtn img').removeClass('show');
        		$('.audiobtn .open').addClass('show');
        		audio.play();
        		playing = 1;
        	}
        });

        if(isMobile) {
        	$('#mobileIn').on('click', function(){
        		audio.play();
				playing = 1;
				var $loadingbox = $('#loadingbox');
				$loadingbox.delay(200).fadeOut(800, function(){
					$loadingbox.remove();
					$('#menu, #logo, #rose, #audiobtn').addClass('show');
				});
        	});
        }
        new IScroll('#iscroller', {
        	scrollbars: false,
        	interactiveScrollbars: false,
        	mouseWheel: true,
        });
        show();
	}

	/** 创建轴对象辅助 **/
	function AxisHelper() {
		const c = new THREE.AxisHelper(200);
		scene.add(c);
	}

	/** 创建鼠标控制器 **/
	function initOrbitControls() {
		// 鼠标镜头控制器，旋转缩放等
		var controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enabled = false;
		controls.enablePan = false;
		controls.enableRotate = false;
		controls.minDistance = 10.0;
		controls.maxDistance = 50.0;
		controls.maxPolarAngle = Math.PI * 0.495;
		controls.target.set( 0, 20, 0 );
		return controls;
	}
	
	/** 创建自定义形状 **/
	function createCustom() {
		var m = new THREE.MeshPhongMaterial({
			color: 0xE2988F,// 0xE2988F
			fog: false,
			side: THREE.DoubleSide,
			specular: 0x111111,
			shininess: 80
		});

		// 创建Shader自定义材质
		// var uniforms = THREE.UniformsUtils.merge([
		// 	THREE.UniformsLib['lights'],
		// 	{ u_color: { value: new THREE.Vector4(1.0, 0.0, 0.0, 1.0) } }
		// ]);

		// var material = new THREE.ShaderMaterial( {
		// 	uniforms,
		// 	vertexShader: VSHADER,
		// 	fragmentShader: FSHADER,
		// 	lights: false,
		// 	side: THREE.DoubleSide,
		// 	fog: false
		// } );

        for (var i=0; i<8000; i++) {
        	// 创建自定义形状
        	var geometry = new THREE.Geometry();

			// 设置顶点位置
	        // geometry.vertices.push(new THREE.Vector3(0, 0.5, 0));
	        // geometry.vertices.push(new THREE.Vector3(0.2, 0.7, -0.1));
	        // geometry.vertices.push(new THREE.Vector3(0.5, 0.5, 0));
	        // geometry.vertices.push(new THREE.Vector3(0, -0.5, 0));
	        // geometry.vertices.push(new THREE.Vector3(-0.5, 0.5, 0));
	        // geometry.vertices.push(new THREE.Vector3(-0.2, 0.7, 0.1));

	        geometry.vertices.push(new THREE.Vector3(0, 0.5, 0));
	        geometry.vertices.push(new THREE.Vector3(0.2, 0, 0));
	        geometry.vertices.push(new THREE.Vector3(0, -0.5, 0));
	        geometry.vertices.push(new THREE.Vector3(-0.2, 0, 0));
	        
	        // 设置顶点连接情况(画三角形)
	        // geometry.faces.push(new THREE.Face3(0, 1, 3));
	        // geometry.faces.push(new THREE.Face3(1, 2, 3));
	        // geometry.faces.push(new THREE.Face3(3, 4, 5));
	        // geometry.faces.push(new THREE.Face3(0, 3, 5));

	        geometry.faces.push(new THREE.Face3(0, 1, 2));
	        geometry.faces.push(new THREE.Face3(0, 2, 3));

	        geometry.computeFaceNormals();

	        var g = new THREE.BoxGeometry(1,1,1);

        	var c = new THREE.Mesh(geometry, m);
        	c.position.x = -Math.random() * 400 + 200;
			c.position.y = -Math.random() * 400 + 200;
			c.position.z = Math.random() * 100 - 100;
			c.speed = Math.random() * 0.1;
			c.myx = c.position.x;
			c.myy = c.position.y;
			c.myz = c.position.z;
			scene.add(c);
        	cubes.push(c);
        }
        $loading.text((percent += 40) + '%');
        show();
	}

	/** 设置各光 **/
	function initLight() {
		try {
            /** 环境光 **/
            light0 = new THREE.AmbientLight(0x888888);
            scene.add(light0);

            /** 平行光 **/
            light1 = new THREE.DirectionalLight(0xffffff, 1.0);
            light1.position.set(0,1,-1);
            //scene.add(light1);

            /** 点光源 **/
            light2 = new THREE.PointLight( 0xffffff, 1, 200 );
			light2.position.set( 0, 0, 0 );
			scene.add( light2 );
			$loading.text((percent += 10) + '%');
        	show();
            return true;
		} catch (e) {
			return false;
		}
	}

	/** 创建精灵平面当背景 **/
	function createSprite() {
		var canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
		var ctx = canvas.getContext('2d');
		var gr = ctx.createRadialGradient(350,50,10,350,50,450);
		gr.addColorStop(0, 'rgb(255,255,255)');
		gr.addColorStop(0.2,'rgb(150,150,160)');
		gr.addColorStop(0.4,'rgb(100,100,105)');
		gr.addColorStop(0.6,'rgb(80,80,80)');
		gr.addColorStop(0.8,'rgb(40,40,40)');
		gr.addColorStop(1, 'rgb(0,0,0)');
		ctx.fillStyle= gr;
		ctx.fillRect(0,0, 512, 512);

		var loader = new THREE.TextureLoader();
		loader.load(canvas.toDataURL("image/png"), function(texture) {
			var material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
			var sprite = new THREE.Sprite(material);
			sprite.scale.x = 3000;
			sprite.scale.y = 1000;
			sprite.scale.z = 1000;
			sprite.position.z = -500;
			scene.add(sprite);
			$loading.text((percent += 20) + '%');
        	show();
		});
	}

	/** 窗口变化时触发 **/
	function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    /** 全屏泛光 **/
	function fullLight(){
		var renderPass = new THREE.RenderPass(scene,camera);
		var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
		effectCopy.renderToScreen = true;
		
		var bloomPass = new THREE.BloomPass(1.5, 4.0, 0.4, 800);//投影的偏移位置,光亮和模糊程度,投影融合程度,泛光精细程度

		composer = new THREE.EffectComposer(renderer,new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight));
		composer.addPass(renderPass);
		composer.addPass(bloomPass);
		composer.addPass(effectCopy);
		$loading.text((percent += 10) + '%');
        show();
	}

	/** 初始化完毕，画面出现，开始动画 **/
	function show() {
		if (percent >= 100) {
			if (isMobile) { // 是移动端，手动触发音乐
				mobileShow();
			} else {
				audio.play();
				playing = 1;
				var $loadingbox = $('#loadingbox');
				$loadingbox.delay(200).fadeOut(800, function(){
					$loadingbox.remove();
					$('#menu, #logo, #rose, #audiobtn').addClass('show');
				});
			}
		}
	}

	/* 移动端进入，为了手动触发音乐 */
	function mobileShow() {
		$('#mobileIn').fadeIn(200);
		$('#loading').fadeOut(200);
	}

	//回调函数，在这个函数里改变你想要改变的对象的值
	function theback(){
		camera.position.x = this.x;
		camera.position.y = this.y;
		camera.position.z = this.z;
		//camera.rotation.x = this.rx;
		//camera.rotation.x = this.ry;
		//camera.rotation.x = this.rz;
		camera.looktos = {x:this.rx, y:this.ry, z:this.rz};
		camera.lookAt(new THREE.Vector3(this.rx, this.ry, this.rz));
	}

	/* 从任意页切换到任意页 */
	var tween;
	function toPage(param, p) {
		if (pageChangeing || pageNow === p) {return;}
		pageChange();
		pageNow = p;
		camera_info = {
			x: camera.position.x,
			y: camera.position.y,
			z: camera.position.z,
			rx: camera.looktos.x,
			ry: camera.looktos.y,
			rz: camera.looktos.z,
		}
		tween = new TWEEN.Tween(camera_info).to(param,1500).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(theback).onComplete(function(){
			if (p === 1) {
				$('#pagebox1').addClass('show');
			} else if (p === 2) {
				$('#pagebox2').addClass('show');
			}
			pageChangeing = false;
		});
		tween.start();
	}

	/* 页面切换 - 消失 */
	function pageChange() {
		pageChangeing = true;
		$('.pagebox').removeClass('show');
	}

	/* 判断是否是移动端，是则返回true,否则返回false */
    function checkMobile() {
		if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
			return true;
		}
		return false;
	}
}
