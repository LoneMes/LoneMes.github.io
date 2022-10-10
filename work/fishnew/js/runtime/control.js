import Sprite from "../base/sprite.js";
import { makeImgSize } from "../base/util.js";
import Userinfo from "../materials/userinfo.js";

const BG_IMG_SRC = "/images/assets/control.jpg"; //"https://s1.ax1x.com/2022/09/19/x9xHhT.png";
const BTN1_SRC = "/images/gameing/btn1.png";
const BTN_RESET_SRC = "/images/gameing/btn_reset.png";

let imgBack;
let btn_left;
let btn_right;
let btn_reset;
let icon_food;
let icon_o2;
let icon_clean;
let icon_fish;

let userInfo;

export function init(onLoad) {
  // 处理背景
  const winW = window.canvasWidth;
  const winH = 160;
  const imgSize = makeImgSize(658, 297, winW, winH);
  imgBack = new Sprite(BG_IMG_SRC, imgSize[2], imgSize[3], imgSize[0], window.canvasHeight - 160, () => onLoad("backControl"));

  // 处理按钮
  btn_left = new Sprite(BTN1_SRC, 100, 100, 10, imgBack.y + 20, () => onLoad("btn1"));
  btn_right = new Sprite(BTN1_SRC, 100, 100, window.canvasWidth - 10 - 100, imgBack.y + 20);
  btn_reset = new Sprite(BTN_RESET_SRC, 80, 40, window.canvasWidth / 2 - 40, imgBack.y + 30 + 10 + 40);

  icon_fish = new Sprite("images/gameing/icon-fish.png", 30, 30, window.canvasWidth - 33, window.canvasHeight - 160 - 116);
  icon_food = new Sprite("images/gameing/icon-food.png", 30, 30, window.canvasWidth - 33, window.canvasHeight - 160 - 88);
  icon_o2 = new Sprite("images/gameing/icon-o2.png", 24, 24, window.canvasWidth - 30, window.canvasHeight - 160 - 56);
  icon_clean = new Sprite("images/gameing/icon-clean.png", 24, 24, window.canvasWidth - 30, window.canvasHeight - 160 - 30);

  refreshUserInfo();
}

// 刷新用户信息
export function refreshUserInfo() {
  userInfo = Userinfo.getUserGameInfo("cotrol");
}

// 渲染
export function render(ctx) {
  imgBack.drawToCanvas(ctx);
  btn_left.drawToCanvas(ctx);
  btn_right.drawToCanvas(ctx);
  btn_reset.drawToCanvas(ctx);
  icon_food.drawToCanvas(ctx);
  icon_o2.drawToCanvas(ctx);
  icon_clean.drawToCanvas(ctx);
  icon_fish.drawToCanvas(ctx);

  // 绘制鱼
  ctx.font = "22px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
  ctx.fillStyle = "#FFFFFF";
  const fishW = ctx.measureText(userInfo.fishs.length);
  ctx.fillText(userInfo.fishs.length, window.canvasWidth - 34 - fishW.width, window.canvasHeight - 160 - 95);

  // 绘制面包物
  const food = Math.round(userInfo.food);
  const w = ctx.measureText(food);
  ctx.fillText(food, window.canvasWidth - 34 - w.width, window.canvasHeight - 160 - 64);

  // 绘制氧气
  ctx.strokeStyle = "#00B36A";
  if (userInfo.o2 < 30) {
    ctx.strokeStyle = "#993720";
  } else if (userInfo.o2 < 60) {
    ctx.strokeStyle = "#cb7929";
  }
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(window.canvasWidth - 40 - userInfo.o2 / 2, window.canvasHeight - 160 - 45);
  ctx.lineTo(window.canvasWidth - 40, window.canvasHeight - 160 - 45);
  ctx.stroke();
  ctx.closePath();

  // 绘制清洁度
  ctx.strokeStyle = "#00B36A";
  if (userInfo.clean < 30) {
    ctx.strokeStyle = "#993720";
  } else if (userInfo.clean < 60) {
    ctx.strokeStyle = "#cb7929";
  }
  ctx.beginPath();
  ctx.moveTo(window.canvasWidth - 40 - userInfo.clean / 2, window.canvasHeight - 160 - 15);
  ctx.lineTo(window.canvasWidth - 40, window.canvasHeight - 160 - 15);
  ctx.stroke();
  ctx.closePath();

  refreshUserInfo();

  // 绘制一条横线
  ctx.beginPath();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.moveTo(0, window.canvasHeight - 160);
  ctx.lineTo(window.canvasWidth, window.canvasHeight - 160);
  ctx.stroke();
  ctx.closePath();
}

// 检查是否点击了某个按钮
export function checkClick(mouseX, mouseY) {
  if (btn_left.isClick(mouseX, mouseY)) {
    return "left";
  } else if (btn_right.isClick(mouseX, mouseY)) {
    return "right";
  } else if (btn_reset.isClick(mouseX, mouseY)) {
    return "reset";
  } else if (mouseX > window.canvasWidth - 100 && mouseY > window.canvasHeight - 160 - 116 && mouseY < window.canvasHeight - 160) {
    return "list";
  }
}

export default {
  init,
  render,
  checkClick,
  refreshUserInfo,
};
