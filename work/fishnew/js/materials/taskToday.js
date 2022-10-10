import Sprite from "../base/sprite.js";
import Userinfo from "./userinfo.js";
import { checkTimeEquals, getTodayStr, getLineLength } from "../base/util.js";
import MessageServer from "../runtime/message.js";
import { refreshUserInfo } from "../runtime/control.js";
import TaskLIst from "./taskLIst.js";

let isFirstToday = false; // 今天是否首次登录
let isFirstTask = false; // 今天是否还可以做首胜任务, 如果为false说明已经做了

const NPC_SRC = "images/assets/girl1.png"; //"https://s1.ax1x.com/2022/10/03/xMxmWT.png";
const TASK_SRC = "images/gameing/icon-girl1.png"; // 任务列表图标

const texts = ["嗯哼，你好，我叫珊瑚礁，我这里是每日委托区，每天首次通关的话，会有额外奖励喔。", "代我去向人鱼公主问好吧，只要将圆圈全部套在柱子上就能传送到海底宫殿觐见人鱼公主了...", "当然不会白白让你帮忙，嗯哼，去吧！"];
const texts2 = ["每天都需要和人鱼公主通信，代我去向人鱼公主问好吧，只要将圆圈全部套在柱子上就能见到人鱼公主本人了。"];
const texts3 = ["真不错，看来你已经见到人鱼公主娜美了，每天问候一次就好啦，明天再来吧。对你越来越有好感了呢，哼！"];
let textStep = 0; // 开始显示第几句话
let textIndex = 0; // 显示到了当前语句的第几个字
let taskIcon;
let npc;
let npcName = "红发·珊瑚礁";

let taskY = 0;

let isTalking = false; // 是否正在对话
let isFirstMakeThis = false; // 是否是第一次点开每日任务

let lineLength = 0;

export function init(ctx) {
  const user = Userinfo.getUserGameInfo();
  // console.log("准备今日更新：", user.food, user.clean);
  const res = checkTimeEquals(user.prevLogin);
  isFirstToday = res[0];
  user.prevLogin = res[1];
  lineLength = getLineLength(ctx);
  if (isFirstToday) {
    MessageServer.push("今日登录奖励");
    MessageServer.push("+100 面包");
    MessageServer.push("+50% 清洁度");
    user.food += 100;
    user.clean += 50;
  }

  // console.log("今日更新完毕:", user.food, user.clean);
  Userinfo.setGameInfo(user, "today1");

  const res1 = checkTimeEquals(user.tasks.taskToday?.prevSuccess || "0");
  isFirstTask = res1[0];

  taskIcon = new Sprite(TASK_SRC, 48, 48, 0, 0);
  npc = new Sprite(NPC_SRC, 165, 370, 0, window.canvasHeight - 160 - 370);

  TaskLIst.push({ id: "taskToday", callback: taskListCallback });

  isFirstMakeThis = !!user.tasks.taskToday?.isFirst;
}

function taskListCallback(i) {
  // console.log("任务列表能得到吗taskToday：", i);
  taskY = (48 + 5) * i;
}

function checkTime() {
  const user = Userinfo.getUserGameInfo();
  const res1 = checkTimeEquals(user.tasks.taskToday?.prevSuccess || "0");
  isFirstTask = res1[0];
}

// 轮询检查是否完成任务 现在改成由父级通知，直接成功
export function checkTaskSuccess() {
  if (!isFirstTask) return;
  // console.log("任务成功");

  let day = new Date().getDay();
  if (day === 0) day = 10;
  const mb = 2000 + day * 100;

  // 2000 + 今天星期几 * 100
  MessageServer.push(`今日首胜`);
  MessageServer.push(`+${mb}面包`);
  const user = Userinfo.getUserGameInfo("task1-2");

  if (!user.tasks.taskToday) {
    user.tasks.taskToday = { prevSuccess: "0", isFirst: true };
  }
  user.tasks.taskToday.prevSuccess = getTodayStr();
  user.food += mb;
  Userinfo.setGameInfo(user, "today2");
  refreshUserInfo();
  isFirstTask = false;
}

// 渲染
let renderI = 0;
export function render(ctx) {
  // 应该根据任务列表中的数量来确定y
  taskIcon.drawToCanvasManual(ctx, 5, taskY + 100);

  if (isTalking) {
    npc.drawToCanvas(ctx, "left");

    // 绘制对话框
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, window.canvasHeight - 160, window.canvasWidth, 160);

    // 绘制对话
    let txt;

    if (isFirstMakeThis) {
      txt = texts;
    } else {
      if (isFirstTask) {
        txt = texts2;
      } else {
        txt = texts3;
      }
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

    ctx.fillStyle = "#DE9B9B";
    ctx.fillText(npcName, l, window.canvasHeight - 155);
  }

  if (!isFirstTask) {
    renderI++;
    if (renderI > 120) {
      // 校验当前是否还能做每日任务，防止跨凌晨的情况
      checkTime();
      renderI = 0;
    }
  }
}

// 检测点击
export function checkClick(mouseX, mouseY) {
  if (isTalking) {
    if (mouseY > window.canvasHeight - 100 && mouseX > window.canvasWidth - 100) {
      if (isFirstMakeThis) {
        if (textStep < texts.length - 1) {
          textStep += 1;
          textIndex = 0;
        } else {
          let user = Userinfo.getUserGameInfo();
          user.tasks.taskToday.isFirst = false;
          Userinfo.setGameInfo(user, "today3");
          isTalking = false;
          isFirstMakeThis = false;
        }
      } else {
        let txt = isFirstTask ? texts2 : texts3;

        if (textStep < txt.length - 1) {
          textStep += 1;
          textIndex = 0;
        } else {
          isTalking = false;
        }
      }
    }
  } else {
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
  checkTaskSuccess,
};
