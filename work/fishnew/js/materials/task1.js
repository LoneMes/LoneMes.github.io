import Sprite from "../base/sprite.js";
import { makeImgSize, getLineLength } from "../base/util.js";
import { getLockNum } from "../runtime/threeCanvas.js";
import Userinfo from "./userinfo.js";
import { refreshUserInfo } from "../runtime/control.js";
import MessageServer from "../runtime/message.js";
import TaskLIst from "./taskLIst.js";

const NPC_SRC = "images/assets/girl0.png"; //"https://s1.ax1x.com/2022/09/25/xEip2d.png";
const FIRST_BACK = "images/assets/task1back.jpg"; //"https://s1.ax1x.com/2022/09/29/xnt2se.jpg";
const TASK_SRC = "images/gameing/icon-girl.png"; // 任务列表图标

const texts = ["嗨，欢迎光临海滨小镇，我叫莎莎，看起来你要和我们在这里生活一段时间了，那还等什么，开始吧！", "现在你的水族箱里只有3条小鱼，你需要精心照料它们，它们会随着时间慢慢长大…", "看到水中这些圆圈了吗，你能尝试把一个圆圈套在柱子上吗？只要点击两侧的按钮就能产生冲击力，试试看吧！"];
const texts2 = ["尝试把圈圈套在柱子上吧，你能做到的！"];
const texts3 = ["恭喜你！你已经学会基本的操作方法了，但是…", "更重要的是照顾好你的鱼儿们，屏幕右下方显示了水族箱的信息…", "充足的食物和环境对鱼的成长至关重要，不用担心，你会找到它们的内在联系的。", "接下来，如果能把圆圈全部套住就能打开前往海底宫殿的传送通道，说不定会遇到美丽的人鱼公主呢，试试看吧！"];
let textStep = 0; // 开始显示第几句话
let textIndex = 0; // 显示到了当前语句的第几个字

let isNeed = false;
let isFirst = false;
let isTalking = false;
let isSuccess = false;

let npc;
let npcName = "池塘莎莎";
let back;
let taskIcon;

let gameResetFunc;
let isCanReset = true;

let taskY = 0;
let lineLength = 0;

export function init(ctx, gameReset, onLoad) {
  lineLength = getLineLength(ctx);

  // 这里应该判定用户是否需要新手引导任务 且 用户是否已经显示过一次，如果不需要，则什么也不做
  const user = Userinfo.getUserGameInfo("task1-1");
  isNeed = !user.tasks.task1.isSuccess;
  isFirst = user.tasks.task1.isFirst;

  if (!isNeed) {
    onLoad("task1back");
    return;
  }

  taskIcon = new Sprite(TASK_SRC, 48, 48, 0, 0);
  npc = new Sprite(NPC_SRC, 165, 370, 0, window.canvasHeight - 160 - 370);

  TaskLIst.push({ id: "task1", callback: taskListCallback });

  if (!isFirst) {
    onLoad("task1back");
    return;
  }

  gameResetFunc = gameReset;
  const winW = window.canvasWidth;
  const winH = window.canvasHeight - 160;

  const imgSize = makeImgSize(750, 1087, winW, winH);
  back = new Sprite(FIRST_BACK, imgSize[2], imgSize[3], imgSize[0], imgSize[1], () => onLoad("task1back"));
}

function taskListCallback(i) {
  taskY = (48 + 5) * i;
}

// 开始任务
export function start() {
  if (!isNeed) return;
  if (isFirst) {
    isTalking = true;
  }

  checkTaskSuccess();
}

// 任务结束，完全卸载资源
export function clear() {
  isTalking = false;
  npc = null;
  back = null;
  // taskIcon = null;
}

// 轮询检查是否完成任务
let checkTimer;
function checkTaskSuccess() {
  checkTimer = setTimeout(() => {
    const num = getLockNum();

    if (num > 0) {
      // console.log("任务成功");
      clearTimeout(checkTimer);

      MessageServer.push("+1000面包");
      const user = Userinfo.getUserGameInfo("task1-2");
      user.tasks.task1.isSuccess = true;
      user.food += 1000;
      Userinfo.setGameInfo(user, "task1-1");
      refreshUserInfo();

      npc.reset();
      isSuccess = true;
      isTalking = true;
      textStep = 0;
      textIndex = 0;
    } else {
      checkTaskSuccess();
    }
  }, 2000);
}

// 渲染
export function render(ctx) {
  if (isNeed) {
    // 应该根据任务列表中的数量来确定y
    taskIcon.drawToCanvasManual(ctx, 5, taskY + 100);
  }

  if (isTalking) {
    if (isFirst) {
      if (textStep === 0) {
        ctx.fillStyle = "#222222";
        ctx.fillRect(0, 0, window.canvasWidth, window.canvasHeight);
        back.drawToCanvas(ctx, "opacity");
      } else {
        back.removeToCanvas(ctx, "opacity");
        if (isCanReset) {
          isCanReset = false;
          gameResetFunc();
        }
      }
    }

    npc.drawToCanvas(ctx, "left");

    // 绘制对话框
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, window.canvasHeight - 160, window.canvasWidth, 160);

    // 绘制对话
    let txt = isFirst ? texts : texts2;
    if (isSuccess) {
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
    const l = Math.max((165 - w.width) / 2, 0) + 10;
    ctx.beginPath();
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 20;
    ctx.moveTo(l, window.canvasHeight - 160);
    ctx.lineTo(l + w.width, window.canvasHeight - 160);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "#9BDBFA";
    ctx.fillText(npcName, l, window.canvasHeight - 155);
  }
}

// 检测点击
export function checkClick(mouseX, mouseY) {
  if (isTalking) {
    if (mouseY > window.canvasHeight - 100 && mouseX > window.canvasWidth - 100) {
      if (isFirst) {
        if (textStep < texts.length - 1) {
          textStep += 1;
          textIndex = 0;
        } else {
          isFirst = false;
          let user = Userinfo.getUserGameInfo("task1-3");
          user.tasks.task1.isFirst = false;
          Userinfo.setGameInfo(user, "task1-2");
          isTalking = false;
          back = null;
        }
      } else {
        if (isSuccess) {
          if (textStep < texts3.length - 1) {
            textStep += 1;
            textIndex = 0;
          } else {
            isTalking = false;
            isNeed = false;
          }
        } else {
          if (textStep < texts2.length - 1) {
            textStep += 1;
            textIndex = 0;
          } else {
            isTalking = false;
          }
        }
      }
    }
  } else if (isNeed) {
    if (taskIcon.isClick(mouseX, mouseY)) {
      npc.reset();
      isTalking = true;
      textStep = 0;
      textIndex = 0;
    }
  }
}

// 是否正在进行对话
export function getTakling() {
  return isTalking;
}

export default {
  init,
  render,
  checkClick,
  getTakling,
  start,
};
