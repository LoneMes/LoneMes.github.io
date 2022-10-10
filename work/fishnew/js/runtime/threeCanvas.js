import * as THREE from "../libs/three/three.module.js";
import * as OIMO from "../libs/oimo.module.js";
import { random } from "../base/util.js";

let world; // 物理世界对象
let scene; // 场景
let camera; // 相机
let renderer; // 渲染器
let cic = []; // 小圈圈
let body_cic = []; // 小圈圈刚体
let ground = []; // 四周的墙壁
let pins = []; // 两根柱子
let boxW, boxH; // 容器真实宽高，px
let boxWH, boxHH; // 除过dpi后
let dpi = 2; // 高清屏
let threeW, threeH; // three中的盒子宽高
let canvas; // 离屏canvas
let ctx;
let successCallbackTemp;

// 以下参数都是为了安卓
let isAndroid = false; // 华为/荣耀/vivo/oppo 特殊处理
let target;
let canvas_huawei;
let ctx_huawei;
let canvas_huawei2;
let ctx_huawei2;
let imageData;
let pixels;

/**================
 * 加载 初始化
 * =============**/

export function onLoad(successCallback) {
  // isAndroid = ['HUAWEI', 'HONOR', 'VIVO', 'OPPO'].includes(sysInfo.brand.toUpperCase());
  // isAndroid = !["IPHONE"].includes(sysInfo.brand.toUpperCase());
  isAndroid = false;

  successCallbackTemp = successCallback;
  canvas = document.createElement("canvas");
  canvas.width = window.canvasWidth;
  canvas.height = window.canvasHeight - 160;
  ctx = canvas.getContext("webgl");

  boxWH = canvas.width;
  boxHH = canvas.height;
  canvas.width *= dpi;
  canvas.height *= dpi;
  boxW = canvas.width;
  boxH = canvas.height;

  threeH = 100;
  threeW = (boxW / boxH) * threeH;

  init3boss(ctx);
  initWorld();
  initLights();

  initGround();
  initPins();
  initCircle();
  initRay();
}

/**================
 * 私有 - 初始化3要素
 * =============**/
function init3boss(ctx) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, boxW / boxH, 0.1, 200);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, context: ctx });

  if (isAndroid) {
    target = new THREE.WebGLRenderTarget(boxW, boxH);
    renderer.setRenderTarget(target);

    canvas_huawei = document.createElement("canvas");
    canvas_huawei.width = boxW;
    canvas_huawei.height = boxH;
    ctx_huawei = canvas_huawei.getContext("2d");

    canvas_huawei2 = document.createElement("canvas");
    canvas_huawei2.width = boxW;
    canvas_huawei2.height = boxH;
    ctx_huawei2 = canvas_huawei2.getContext("2d");

    imageData = ctx_huawei.createImageData(boxW, boxH);
    pixels = new Uint8Array(imageData.data.length);
  }

  camera.position.set(0, 0, 50);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 100前景ground高度，50-相机到ground的距离，不用算了，距离和高度固定，结果等于90度
  // 不过过程还是写在这
  // camera.fov = Math.atan((100/2)/50) * 2 * (180 / Math.PI);
  // camera.updateProjectionMatrix();

  renderer.setSize(boxW, boxH, true);
  renderer.gammaOutput = true; // 所有纹理和颜色需要乘以gamma输出，颜色会亮丽许多
  renderer.setClearColor(0x000000, 0);
}

/**================
 * 私有 - 初始化物理引擎
 * =============**/
function initWorld() {
  world = new OIMO.World({
    timestep: 1 / 60, // 刷新频率
    iterations: 8, // 迭代次数
    broadphase: 2, // 物理类型？1蛮力计算，2扫描和修剪，3卷积树
    info: false, // 是否输出统计信息
    worldscale: 1, // 世界缩放比例
    random: true, // 随机因子
    gravity: [0, -9.8, 0], // mock 重力加速度矢量 [0, -9.8, 0]
  });
}

/**================
 * 私有 - 初始化光
 * =============**/
function initLights() {
  scene.add(new THREE.AmbientLight(0x222222));
  const l2 = new THREE.DirectionalLight(0xcccccc, 1);
  l2.position.set(0, 5, 10);
  scene.add(l2);
}

/**================
 * 私有 - 初始化pin对象
 * =============**/
const size = [2, 2, 5, 3.6, 12, 12, 1, 24, 1];
console.log("哈？", THREE);
const pin_box = new THREE.BoxGeometry(size[0], size[1], size[2]); // 圆球连接的那个柱子
const pin_box2 = new THREE.SphereGeometry(size[3], size[4], size[5]); // 圆球
const pin_box3 = new THREE.CylinderGeometry(0.4, 1.4, 24, 24, 24); // 针 mock (0.4, 1.4, 24, 24, 24) (1.2, 1.2, 34, 24, 24)
const pin_material = new THREE.MeshPhongMaterial({ color: 0xccccff });

function initPins() {
  const pos = [-threeW / 2 / 2, -20, -7.5, -threeW / 2 / 2, -20, -4, -threeW / 2 / 2, -8, -4];

  pins.push(new THREE.Mesh(pin_box, pin_material));
  pins.push(new THREE.Mesh(pin_box2, pin_material));
  pins.push(new THREE.Mesh(pin_box3, pin_material));

  const body1 = world.add({
    type: "box",
    size: [size[0], size[1], size[2]],
    pos: [pos[0], pos[1], pos[2]],
    world: world,
  });
  const body2 = world.add({
    type: "box",
    size: [size[3]],
    pos: [pos[3], pos[4], pos[5]],
    world: world,
  });
  const body3 = world.add({
    type: "box",
    size: [size[6], size[7], size[8]],
    pos: [pos[6], pos[7], pos[8]],
    world: world,
  });
  pins[0].position.copy(body1.getPosition());
  pins[1].position.copy(body2.getPosition());
  pins[2].position.copy(body3.getPosition());

  scene.add(pins[0]);
  scene.add(pins[1]);
  scene.add(pins[2]);

  // 创建右边的
  pins.push(pins[0].clone());
  pins.push(pins[1].clone());
  pins.push(pins[2].clone());

  const rbody1 = world.add({
    type: "box",
    size: [size[0], size[1], size[2]],
    pos: [-pos[0], pos[1], pos[2]],
    world: world,
  });
  const rbody2 = world.add({
    type: "box",
    size: [size[3]],
    pos: [-pos[3], pos[4], pos[5]],
    world: world,
  });
  const rbody3 = world.add({
    type: "box",
    size: [size[6], size[7], size[8]],
    pos: [-pos[6], pos[7], pos[8]],
    world: world,
  });

  pins[3].position.copy(rbody1.getPosition());
  pins[4].position.copy(rbody2.getPosition());
  pins[5].position.copy(rbody3.getPosition());

  scene.add(pins[3]);
  scene.add(pins[4]);
  scene.add(pins[5]);
}

/**================
 * 私有 - 初始化10个小圈
 * =============**/
const cic_geometry = new THREE.TorusGeometry(4, 0.6, 8, 32);
const cic_material = [new THREE.MeshToonMaterial({ color: 0xdd0000 }), new THREE.MeshToonMaterial({ color: 0x2244dd }), new THREE.MeshToonMaterial({ color: 0xdddd00 }), new THREE.MeshToonMaterial({ color: 0x00dd00 })];
const cic_geo_in = new THREE.CircleGeometry(3.4, 16);
const cic_material_in = new THREE.MeshToonMaterial({ color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0 });
const cic_in = []; // 需要检测相交性的对象
function initCircle() {
  const types = ["box", "box", "box", "box", "box", "box", "box", "box", "box", "box", "box", "box"];
  const sizes = [1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1, 1, 2.2, 1];
  const ros = [30, 0, 0, 60, 60, -30, 90, 90, -60, 120, 30, -90, 150, 60, 60, 180, 90, 30, 210, 30, 0, 240, 60, -30, 270, 90, -60, 300, 30, 90, 330, 60, 60, 360, 90, 30];

  const l = 3.5; // 圆心到顶点距离
  const r_d = Math.cos((Math.PI / 180) * 15) * l; // 圆心到边距离

  const pos = [
    -r_d,
    0,
    0,
    -Math.cos((Math.PI / 180) * 30) * r_d,
    Math.sin((Math.PI / 180) * 30) * r_d,
    0,
    -Math.cos((Math.PI / 180) * 60) * r_d,
    Math.sin((Math.PI / 180) * 60) * r_d,
    0,
    0,
    r_d,
    0,
    Math.cos((Math.PI / 180) * 60) * r_d,
    Math.sin((Math.PI / 180) * 60) * r_d,
    0,
    Math.cos((Math.PI / 180) * 30) * r_d,
    Math.sin((Math.PI / 180) * 30) * r_d,
    0,
    r_d,
    0,
    0,
    Math.cos((Math.PI / 180) * 30) * r_d,
    -Math.sin((Math.PI / 180) * 30) * r_d,
    0,
    Math.cos((Math.PI / 180) * 60) * r_d,
    -Math.sin((Math.PI / 180) * 60) * r_d,
    0,
    0,
    -r_d,
    0,
    -Math.cos((Math.PI / 180) * 60) * r_d,
    -Math.sin((Math.PI / 180) * 60) * r_d,
    0,
    -Math.cos((Math.PI / 180) * 30) * r_d,
    -Math.sin((Math.PI / 180) * 30) * r_d,
    0,
  ];

  for (let i = 0; i < 10; i++) {
    // mock 10
    let x, y;
    if (i < 5) {
      x = -20 + i * 10;
      y = 40;
    } else {
      x = -70 + i * 10;
      y = 30;
    }
    const wc = world.add({
      type: types, // 类型 盒子/球体/圆柱体
      size: sizes, // 尺寸
      posShape: pos, // 真正的刚体形状
      pos: [x, y, -5], // 位置 mock [x, y , -5] [ -threeW / 2 / 2 - 2.8, 0, -4]
      rot: ros, // 旋转信息
      friction: 0.4, // 密度 ？
      move: true, // mock 静态对象或动态对象

      name: `cic${i}`,
    });

    const c = new THREE.Mesh(cic_geometry, cic_material[random(0, 3)]);
    const c_in = new THREE.Mesh(cic_geo_in, cic_material_in);
    c_in.parentIndex = i;
    c.add(c_in);

    cic.push(c);
    body_cic.push(wc);
    cic_in.push(c_in);
    scene.add(c);
  }
}

/**================
 * 私有 - 初始化墙体
 * =============**/
const ground_material = new THREE.MeshBasicMaterial({ color: 0x002200, transparent: true, opacity: 0 });
const ground_material1 = new THREE.MeshBasicMaterial({ color: 0x000022, transparent: true, opacity: 0 });
let ground_geometry; // 地面geometry

function initGround() {
  ground_geometry = new THREE.BoxGeometry(threeW, threeH, 1); // 地面geometry
  ground.push(new THREE.Mesh(ground_geometry, ground_material)); // 正面
  ground[0].position.set(0, 0, 0.1);

  ground.push(new THREE.Mesh(ground_geometry, ground_material1)); // 背面
  ground[1].position.set(0, 0, -10); // 正面与背面距离10

  ground.push(new THREE.Mesh(ground_geometry, ground_material1)); // 左边
  ground[2].rotation.set(0, Math.PI / 2, 0);
  ground[2].position.set(-threeW / 2, 0, 0);

  ground.push(ground[2].clone()); // 右边
  ground[3].position.set(threeW / 2, 0, 0);

  ground.push(new THREE.Mesh(ground_geometry, ground_material1)); // 上边
  ground[4].rotation.set(Math.PI / 2, 0, 0);
  ground[4].position.set(0, threeH / 2, 0);

  ground.push(ground[4].clone()); // 下边
  ground[5].position.set(0, -threeH / 2, 0);

  ground.forEach(item => {
    scene.add(item);
  });

  world.add({ size: [threeW, threeH, 2], pos: [0, 0, 0.1], friction: 0, world }); // 正面
  world.add({ size: [threeW, threeH, 2], pos: [0, 0, -10], friction: 0, world }); // 背面
  world.add({ size: [threeW, threeH, 2], pos: [-threeW / 2, 0, 0], rot: [0, 90, 0], friction: 0, world }); // 左边
  world.add({ size: [threeW, threeH, 2], pos: [threeW / 2, 0, 0], rot: [0, 90, 0], friction: 0, world }); // 右边
  world.add({ size: [threeW, threeH, 2], pos: [0, threeH / 2, 0], rot: [90, 0, 0], friction: 0, world }); // 上边
  world.add({ size: [threeW, threeH, 2], pos: [0, -threeH / 2, 0], rot: [90, 0, 0], friction: 0, world }); // 下边
}

/**================
 * 私有 - 初始化柱子的射线
 * =============**/
let rayLeft;
let rayRight;
function initRay() {
  const leftP = pins[2].position;
  const rightP = pins[5].position;

  rayLeft = new THREE.Raycaster(new THREE.Vector3(leftP.x, leftP.y - 12, leftP.z), new THREE.Vector3(0, 1, 0), 0, 22);
  rayLeft.intersectObjects(cic_in);
  rayRight = new THREE.Raycaster(new THREE.Vector3(rightP.x, rightP.y - 12, rightP.z), new THREE.Vector3(0, 1, 0), 0, 22);
  rayRight.intersectObjects(cic_in);

  // const arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(rightP.x, rightP.y - 12, rightP.z), 23, 0xffffff, 5, 5);
  // console.log("arrowHelper", arrowHelper);
  // scene.add(arrowHelper);
}

/**================
 * 私有 - 判断小圆圈套住的情况
 * =============**/
/**
 * 小圆圈半径4，圆心到内表面距离3.4，小环本身半径0.6
 * 中间pin刚体半径1
 * 2.4是圈套在柱子上时，pin中心距离圈圆心的最大可能距离
 */
let lockNum = 0;

function checkLock() {
  const intersectsL = rayLeft.intersectObjects(cic_in);
  const intersectsR = rayRight.intersectObjects(cic_in);

  const locksArr = [...intersectsL, ...intersectsR];
  lockNum = locksArr.length;

  for (let i = 0; i < body_cic.length; i++) {
    cic[i].isLock = false;
  }
  for (let i = 0; i < locksArr.length; i++) {
    // console.log('what is',body_cic, locksArr[i]);
    cic[locksArr[i].object.parentIndex].isLock = true;
  }

  // todo check
  if (lockNum >= 10) {
    successCallbackTemp();
  }
}

// 得到当前套住了多少个
export function getLockNum() {
  return lockNum;
}

/**================
 * 按钮被点击
 * @param t 'left' / 'right'
 * =============**/
export function onBtnClick(t) {
  const z = Math.random() * 20 - 10;
  for (let i = 0; i < body_cic.length; i++) {
    const p = cic[i].position;
    const lock = cic[i].isLock ? 4 : 1;

    if (t === "left") {
      const s_x = Math.abs(p.x - -threeW / 2);
      const s_y = Math.abs(p.y - -threeH / 2);
      const far = Math.sqrt(s_x ** 2 + s_y ** 2);
      body_cic[i].applyImpulse(p, { x: (230 - far * 2) / lock, y: (450 - far * 2) / lock, z });
    } else {
      const s_x = Math.abs(p.x - threeW / 2);
      const s_y = Math.abs(p.y - threeH / 2);
      const far = Math.sqrt(s_x ** 2 + s_y ** 2);
      body_cic[i].applyImpulse(p, { x: (-230 + far * 2) / lock, y: (450 - far * 2) / lock, z });
    }
  }
}

/**================
 *  点击重新开始按钮
 * =============**/
export function onReset() {
  world.clear();

  cic.forEach(item => {
    scene.remove(item);
  });

  ground.forEach(item => {
    scene.remove(item);
  });

  pins.forEach(item => {
    scene.remove(item);
  });

  body_cic.length = 0;
  cic_in.length = 0;
  ground.length = 0;
  cic.length = 0;
  pins.length = 0;
  timeOld = Date.now();
  timeNow = timeOld;

  initGround();
  initPins();
  initCircle();
}

/**================
 *  渲染
 * =============**/
let timeOld = Date.now();
let timeNow = timeOld;
export function render(ctxMain) {
  if (world == null) return;

  world.step(); // 更新world

  for (let i = 0; i < body_cic.length; i++) {
    cic[i].position.copy(body_cic[i].getPosition());
    cic[i].quaternion.copy(body_cic[i].getQuaternion());
    cic[i].geometry.computeBoundingBox();
  }

  timeNow = Date.now();
  if (timeNow - timeOld > 3000) {
    checkLock();
    timeOld = timeNow;
  }
  renderer.render(scene, camera);

  if (isAndroid) {
    ctx.readPixels(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);

    imageData.data.set(pixels);
    ctx_huawei.putImageData(imageData, 0, 0);
    //清除
    ctx_huawei2.clearRect(0, 0, canvas_huawei2.width, canvas_huawei2.height);
    //上下镜像翻转
    ctx_huawei2.translate(0, canvas_huawei2.height);
    ctx_huawei2.scale(1, -1);
    ctx_huawei2.drawImage(canvas_huawei, 0, 0);
    //恢复
    ctx_huawei2.translate(0, canvas_huawei2.height);
    ctx_huawei2.scale(1, -1);
    ctxMain.drawImage(canvas_huawei2, 0, 0, boxWH, boxHH);
  } else {
    ctxMain.drawImage(canvas, 0, 0, boxWH, boxHH);
  }

  // ctxMain.fillStyle = "#f00";
  // ctxMain.font = "16px SimSun, Songti SC";
  // ctxMain.fillText(lockNum, 50, 50);
}

export default {
  onLoad,
  render,
  onReset,
  getLockNum,
};
