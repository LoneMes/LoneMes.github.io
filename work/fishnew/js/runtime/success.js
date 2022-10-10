import Sprite from "../base/sprite.js";
import { makeImgSize, makeImgSize2, random, getLineLength } from "../base/util.js";
import Userinfo from "../materials/userinfo.js";
import MessageServer from "../runtime/message.js";
import { refreshFishData } from "../runtime/fish.js";
import { getFishWeight } from "../base/util.js";
const BG_IMG_SRC = "packageSuccess/assets/success_back.jpg"; //"https://s1.ax1x.com/2022/10/04/xl1Jne.jpg";
const BG_WIDTH = 750;
const BG_HEIGHT = 1333;

const BTN_SRC = "packageSuccess/assets/success-btn.png";
// const BTN_RANK_SRC = "packageSuccess/assets/btn_rank.png";
const LOVE_IMG_SRC = "packageSuccess/assets/love.png";
const NPC_SRC = "packageSuccess/assets/girl3.png"; //"https://s1.ax1x.com/2022/10/04/xQ4cIH.png";

// 首次通关
const texts1 = ["感谢你，陆地来的使者，我是住在海底宫殿的娜美，我要送你一些珍贵的小鱼，这是我们友谊的象征。", "以后也要常来我的宫殿找我玩呀。不过有一件事我很担心...", "在大洋的深处，有一个黑暗的秘密，最近那个地方有点异样...", "抱歉，我不应该初次见面就说这些，等下次你来时我再跟你细说吧。"];
// 1
const texts2 = ["欢迎欢迎，又见到你啦，这条小鱼送给你，它们有一天一定会长得非常大的。", "我要去大洋的深处探险，看起来有异常的能量出现在黑暗的深渊之中，我们必须查清楚到底发生了什么。", "再会，我的好朋友，等我消息。"];
// 2
const texts3 = ["你来啦，我陆地上的朋友，很高兴再次见到你。", "我带来了一些消息，我们将持续调查海底深渊中的异常能量，到时候说不定还需要你的帮忙。", "希望我们不要断了联系，再会。"];
let imgBack;
let imgLove;
let imgBtn;
// let imgRankBtn;
let npc;
let npcName = "阿拉贡·海啸·深渊凝视之召唤风暴的娜美";
let newFish; // 本次获得的鱼苗精灵图
let newFishData;
let passTime = 0;

const loveInfo = {
  x: 0,
  y: 0,
  opacity: 0,
  yMove: 0,
};

const imgBackInfo = {
  opacity: 0,
};

let score = 0; // 本局游戏的得分
let startTime = 0; // 游戏开始的时间

let isTalking = false;
let textStep = 0;
let textIndex = 0;

let lineLength = 0;

function initCover() {
  const winW = window.canvasWidth;
  const winH = window.canvasHeight;

  return makeImgSize(BG_WIDTH, BG_HEIGHT, winW, winH);
}

export function init(ctx) {
  initWidthPackage();

  lineLength = getLineLength(ctx);
}

function initWidthPackage() {
  let imgSize = initCover();
  imgBack = new Sprite(BG_IMG_SRC, imgSize[2], imgSize[3], imgSize[0], imgSize[1]);
  imgLove = new Sprite(LOVE_IMG_SRC, 64, 60, 0, 0);
  imgBtn = new Sprite(BTN_SRC, 160, 58, window.canvasWidth / 2 - 80, window.canvasHeight - 100);
  // imgRankBtn = new Sprite(BTN_RANK_SRC, 160, 58, window.canvasWidth / 2 - 80, window.canvasHeight - 80 - 58 - 25);
  npc = new Sprite(NPC_SRC, 650, 793, window.canvasWidth / 2 - 450, 50);
}

export function destroy() {
  imgBack = null;
  imgLove = null;
  imgBtn = null;
  // imgRankBtn = null;
  newFish = null;
  isTalking = false;
  textStep = 0;
  textIndex = 0;
}

// 计算得分 也表示游戏成功，进入成功页面, 结算奖励
export function getScore(endTime) {
  // 根据游戏时长计算分数
  const time = (endTime - startTime) / 1000; // 秒
  const timeMuch = Math.max(1, 300 - time);
  let base = 16;
  if (time > 600) {
    base = 16;
  } else if (time > 400) {
    base = 20;
  } else {
    base = 24;
  }
  score = Math.round(timeMuch * base); // 最终获得的面包数
  const user = Userinfo.getUserGameInfo();

  // 找出最大的一条鱼的重量
  let maxIndex = 0;
  for (let i = 0; i < user.fishs.length; i++) {
    if (user.fishs[i].exp > user.fishs[maxIndex].exp) {
      maxIndex = i;
    }
  }

  const weight = getFishWeight(user.fishs[maxIndex].exp);
  const fishName = Userinfo.fishList.find(item => item.id === user.fishs[maxIndex].id)?.name || "";
  const exp = user.fishs[maxIndex].exp;

  isTalking = true;

  MessageServer.push(`通关！`);
  MessageServer.push(`+${score}面包`);

  user.food += score;
  user.passTime += 1;
  passTime = user.passTime;

  // 随机奖励鱼苗 最多同时存在20条
  if (user.fishs.length < 20) {
    const id = random(1, Userinfo.fishList.length);

    // 金枪鱼只能拥有一条，自动转换小丑鱼
    if (id === 10 && user.fishs.find(item => item.id === 10)) {
      id = 3;
    }

    user.fishs.push({ id, exp: 0, createDate: Date.now() });
    // console.log("user.fishs:", user.fishs, id);
    user.fishs = JSON.parse(JSON.stringify(user.fishs));
    newFishData = Userinfo.fishList.find(item => item.id === id);
    newFish = new Sprite(newFishData.src, 100, 100, window.canvasWidth / 2 - 50, 180);
    refreshFishData();
  }

  Userinfo.setGameInfo(user, "success");

  return { score, passTime, weight, fishName, exp };
}

// 显示排行榜
let isRankShow = false;
let sharedCanvas;
let sharedCanvasSize;

export function checkClick(mouseX, mouseY) {
  if (isTalking) {
    if (mouseY > window.canvasHeight - 100 && mouseX > window.canvasWidth / 2) {
      let txt;
      switch (passTime) {
        case 1:
          txt = texts1;
          break;
        case 2:
          txt = texts2;
          break;
        default:
          txt = texts3;
      }

      if (textStep < txt.length - 1) {
        textStep += 1;
        textIndex = 0;
      } else {
        isTalking = false;
      }
    }
    return;
  }

  if (imgBtn.isClick(mouseX, mouseY)) {
    isRankShow = false;
    return "again";
  }
}

export function resetStartTime() {
  startTime = Date.now();
}

export function render(ctx) {
  ctx.save();
  ctx.globalAlpha = imgBackInfo.opacity;
  imgBack.drawToCanvas(ctx);
  ctx.restore();
  if (imgBackInfo.opacity < 1) {
    imgBackInfo.opacity += 0.1;
  }

  loveInfo.yMove += 1;
  if (loveInfo.yMove < 20 && loveInfo.opacity < 1) {
    loveInfo.opacity = Math.min(1, loveInfo.opacity + 0.1);
  }
  if (loveInfo.yMove >= 80 && loveInfo.opacity > 0) {
    loveInfo.opacity = Math.max(0, loveInfo.opacity - 0.1);
  }

  if (loveInfo.yMove > 100) {
    loveInfo.x = random(0, window.canvasWidth - 60);
    loveInfo.y = random(100, window.canvasHeight - 60);
    loveInfo.yMove = 0;
  }

  ctx.save();
  ctx.globalAlpha = loveInfo.opacity;
  imgLove.x = loveInfo.x;
  imgLove.y = loveInfo.y - loveInfo.yMove;
  imgLove.drawToCanvas(ctx);
  ctx.restore();

  if (isTalking) {
    npc.drawToCanvas(ctx, "opacity");

    // 绘制对话框
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, window.canvasHeight - 160, window.canvasWidth, 160);

    // 绘制对话
    let txt;
    switch (passTime) {
      case 1:
        txt = texts1;
        break;
      case 2:
        txt = texts2;
        break;
      default:
        txt = texts3;
    }

    ctx.fillStyle = "#fafafa";
    ctx.font = "18px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";

    const arrText = txt[textStep].substring(0, textIndex);
    let y = window.canvasHeight - 120; // window.canvasHeight - 160 + 40;
    let startNum = 0;
    for (let i = 0; startNum < textIndex; i++) {
      ctx.fillText(arrText.substring(startNum, lineLength + startNum), 20, y);
      y += 24;
      startNum += lineLength;
    }

    if (textIndex < txt[textStep].length) {
      textIndex += 1;
    }

    ctx.fillStyle = "#22ff22";
    ctx.fillText("继续 >>", window.canvasWidth - 80, window.canvasHeight - 40);

    // 画名字
    ctx.font = "14px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
    const w = ctx.measureText(npcName);
    const l = window.canvasWidth / 2 - w.width / 2;
    ctx.beginPath();
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 20;
    ctx.moveTo(l, window.canvasHeight - 160);
    ctx.lineTo(l + w.width, window.canvasHeight - 160);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "#b854d5";
    ctx.fillText(npcName, l, window.canvasHeight - 155);
  } else {
    if (!isRankShow) {
      ctx.fillStyle = "#22CC22";
      ctx.font = "bold 32px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;

      // 绘制奖励的鱼
      if (newFish) {
        newFish.drawToCanvas(ctx);
        const str = `获得【${newFishData.name}】`;
        const w = ctx.measureText(str);
        ctx.fillText(str, window.canvasWidth / 2 - w.width / 2, 300);
        ctx.strokeText(str, window.canvasWidth / 2 - w.width / 2, 300);
      }

      // 得分
      const str = `获得:【 ${score}】面包`;
      const textInfo = ctx.measureText(str);

      ctx.fillText(str, window.canvasWidth / 2 - textInfo.width / 2, 200 + (newFish ? 150 : 0));
      ctx.strokeText(str, window.canvasWidth / 2 - textInfo.width / 2, 200 + (newFish ? 150 : 0));
    } else {
      ctx.drawImage(sharedCanvas, sharedCanvasSize[0], sharedCanvasSize[1] + 5, sharedCanvasSize[2], sharedCanvasSize[3]);
    }

    // 排行榜按钮
    // imgRankBtn.drawToCanvas(ctx);
    // 带回城堡按钮
    imgBtn.drawToCanvas(ctx);
  }
}

export default {
  init,
  destroy,
  render,
  checkClick,
  getScore,
  resetStartTime,
};
