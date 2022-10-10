import Sprite from "../base/sprite.js";
import Userinfo from "../materials/userinfo.js";
import { getFishWeight, formatTime } from "../base/util.js";
import { getFishSprite } from "./fish.js";

let btn_l;
let btn_r;
let btn_close;

let isShow = false;
let fishInfo = [];

let pageAll = 1;
let pageNo = 1;
let pageFish = [];

let userInfo;

export function init() {
  btn_l = new Sprite("images/gameing/btn-left-h.png", 48, 48, window.canvasWidth / 2 - 24 - 50, window.canvasHeight - 250);
  btn_r = new Sprite("images/gameing/btn-right-h.png", 48, 48, window.canvasWidth / 2 - 24 + 50, window.canvasHeight - 250);
  btn_close = new Sprite("images/gameing/btn-close.png", 48, 48, window.canvasWidth / 2 - 24, window.canvasHeight - 170);
}

export function render(ctx) {
  if (!isShow) return;

  ctx.save();
  ctx.fillStyle = "#000000";
  ctx.globalAlpha = 0.9;
  ctx.fillRect(0, 0, window.canvasWidth, window.canvasHeight);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";

  // 绘制面包物
  const food = `${Math.round(userInfo.food)} 面包`;
  const w = ctx.measureText(food);
  ctx.fillText(food, window.canvasWidth - 5 - w.width, window.canvasHeight - 160 - 64);

  // 绘制氧气
  const o2 = `${userInfo.o2.toFixed(2)}% 氧气`;
  const w2 = ctx.measureText(o2);
  ctx.fillText(o2, window.canvasWidth - 5 - w2.width, window.canvasHeight - 160 - 40);

  // 绘制清洁
  const clean = `${userInfo.clean.toFixed(2)}% 清洁度`;
  const w3 = ctx.measureText(clean);
  ctx.fillText(clean, window.canvasWidth - 5 - w3.width, window.canvasHeight - 160 - 15);

  let offset = 65;
  for (let i = 0; i < pageFish.length; i++) {
    const item = pageFish[i];
    ctx.drawImage(item.sprite.img, 10, 100 + offset * i, 60, 60);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
    ctx.fillText(item.name, 80, 120 + offset * i);
    ctx.font = "14px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
    ctx.fillStyle = "#f7f7f7";
    ctx.fillText(`领养于 ${item.createDate}`, 180, 130 + offset * i);

    ctx.fillText(item.weight, 80, 140 + offset * i);
  }

  const pageSize = `${pageNo}/${pageAll}`;
  const pageInfo = ctx.measureText(pageSize);
  ctx.fillText(`${pageNo}/${pageAll}`, (window.canvasWidth - pageInfo.width) / 2, window.canvasHeight - 220);

  btn_l.drawToCanvas(ctx);
  btn_r.drawToCanvas(ctx);
  btn_close.drawToCanvas(ctx);
}

// 检查是否点击了某个按钮
export function checkClick(mouseX, mouseY) {
  if (btn_l.isClick(mouseX, mouseY)) {
    if (pageNo > 1) {
      pageNo--;
      pageFish = fishInfo.slice(5 * (pageNo - 1), 5 * (pageNo - 1) + 5);
    }
    return "left";
  } else if (btn_r.isClick(mouseX, mouseY)) {
    if (pageNo < pageAll) {
      pageNo++;
      pageFish = fishInfo.slice(5 * (pageNo - 1), 5 * (pageNo - 1) + 5);
    }
    return "right";
  } else if (btn_close.isClick(mouseX, mouseY)) {
    isShow = false;
    return "close";
  }
}

export function setShow(type) {
  if (type) {
    const fishSprites = getFishSprite();
    userInfo = Userinfo.getUserGameInfo();
    fishInfo = userInfo.fishs.map(item => {
      const info = Userinfo.fishList.find(fishData => fishData.id === item.id);
      const sprite = fishSprites.find(fishData => fishData.id === item.id).sprite;

      return {
        weight: getFishWeight(item.exp),
        createDate: formatTime(item.createDate),
        sprite,
        ...info,
      };
    });
    pageAll = Math.max(1, fishInfo.length % 5 === 0 ? fishInfo.length / 5 : Math.floor(fishInfo.length / 5) + 1);
    pageNo = 1;
    pageFish = fishInfo.slice(5 * (pageNo - 1), 5 * (pageNo - 1) + 5);

    // console.log("fishInfo:", fishInfo);
  }
  isShow = type;
}

export function getShow() {
  return isShow;
}

export default {
  init,
  render,
  checkClick,
  getShow,
  setShow,
};
