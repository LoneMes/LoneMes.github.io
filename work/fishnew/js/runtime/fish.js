// 鱼控制器

import Sprite from "../base/sprite.js";
import Userinfo from "../materials/userinfo.js";
import { random } from "../base/util.js";

/**===========================
 * fishData保存了物料及sourceData的全部字段，用于游戏中
 * exp: number 经验值，根据经验值计算缩放比例
 * weight: 重量，由经验值换算
 * 
 ==============================*/
let fishData = [];

/**===========================
 * fishSprites 用于canvas的渲染， 要一直改变里面的值， x,y,size等
 ==============================*/
let fishSprites = [];

export function init() {
  let user = Userinfo.getUserGameInfo("fish-init");

  if (!user.fishs) {
    const timeNow = Date.now();
    let fishSource = []; // sourceData是保存在缓存中的数据，只有id，exp和时间
    fishSource.push({ id: 1, exp: 0, createDate: timeNow });
    fishSource.push({ id: 2, exp: 0, createDate: timeNow });
    fishSource.push({ id: 3, exp: 0, createDate: timeNow });

    user.fishs = fishSource;
    user.fishUpdateDate = timeNow;
    Userinfo.setGameInfo(user, "fish-init");
  }

  refreshFishData();

  // console.log("鱼更新完毕：", fishData, fishSprites);

  for (let i = 0; i < fishSprites.length; i++) {
    fishReset(fishSprites[i]);
  }

  saveData();
}

// 鱼增加活减少时应该刷新鱼数据
export function refreshFishData() {
  let user = Userinfo.getUserGameInfo("refreshFishData");
  fishData.length = 0;
  fishSprites.length = 0;
  for (let i = 0; i < user.fishs.length; i++) {
    const f = user.fishs[i];
    const ff = Userinfo.fishList.find(item => item.id === f.id);
    if (ff) {
      fishData.push({ ...ff, ...f });
    }
  }

  for (let i = 0; i < fishData.length; i++) {
    const f = fishData[i];
    const sprite = new Sprite(f.src, 32, 32, 0, 0);
    const size = Math.min(0.5 + f.exp / 27000, 20); // 54000半个月，养一个月变成2倍大, 最大20倍
    fishSprites.push({ id: f.id, sprite, x: -120, width: 32, height: 32, y: 0, speed: 1, size, right: true });
  }
}

// 重置鱼的位置 / 大小
function fishReset(fishObj) {
  fishObj.width = fishObj.sprite.width = 48 * fishObj.size;
  fishObj.height = fishObj.sprite.height = 48 * fishObj.size;
  // console.log("fishObj==:", fishObj.sprite.width, fishObj.size);
  fishObj.speed = 1.5 - fishObj.size / 20 + random(0, 1, false);
  fishObj.y = random(-fishObj.height, window.canvasHeight - 160 - fishObj.height / 2);
  fishObj.right = random(0, 1, false) > 0.5;
  if (fishObj.right) {
    fishObj.x = -fishObj.width - random(50, 500);
  } else {
    fishObj.x = window.canvasWidth + random(50, 500);
  }
}

// 保存一次数据,将最新鱼相关数据存到缓存
export function saveData() {
  const fishSource = fishData.map(item => {
    return {
      id: item.id,
      exp: item.exp,
      createDate: item.createDate,
    };
  });
  const user = Userinfo.getUserGameInfo("fish-updateData");
  user.fishs = fishSource;
  Userinfo.setGameInfo(user, "fish-save");
}

/**
 * 绘制向右的鱼，需要根据鱼位置翻转画布
 */
function drawRight(fishObj, ctx) {
  ctx.save();
  ctx.translate(fishObj.x * 2 + fishObj.width, 0);
  ctx.scale(-1, 1);

  fishObj.sprite.drawToCanvasManual(ctx, fishObj.x, fishObj.y);
  ctx.restore();
}

/**================================
 * 渲染
===================================*/
let timerStep = 0;
export function render(ctx) {
  for (let i = 0; i < fishSprites.length; i++) {
    const item = fishSprites[i];
    if (item.right) {
      item.x += item.speed;
      if (item.x > window.canvasWidth + item.width + 50) {
        fishReset(item);
      }
      drawRight(item, ctx);
    } else {
      item.x -= item.speed;
      if (item.x < -item.width - 50) {
        fishReset(item);
      }
      item.sprite.drawToCanvasManual(ctx, item.x, item.y);
    }
  }

  // 每过5秒同步数据，更新鱼经验值等
  timerStep += 1;
  if (timerStep >= 300) {
    Userinfo.syncGameInfo();
    timerStep = 0;
  }
}

export function getFishSprite() {
  return fishSprites;
}

export default {
  init,
  saveData,
  render,
  getFishSprite,
  refreshFishData,
};
