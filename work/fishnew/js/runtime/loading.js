import Sprite from "../base/sprite.js";
// import { syncCloudUserInfo } from "../materials/userinfo";

const t1 = "抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。";
const t2 = "适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。";

const LOGO_SRC = "images/start/logo.png";
const START_SRC = "images/start/btn-start.png";
const BACK_SRC = "images/start/fish-back.png";

let logo;
let start;
let fish;
let fish_row = 0;
let fish_col = 0;
let fish_offset = 0;
let fish_size = 64;
let alpha = 0;

let progress = 0;

export async function init(bindCheckLoaded) {
  logo = new Sprite(LOGO_SRC, 200, 168, window.canvasWidth / 2 - 100, window.canvasHeight * 0.1);
  start = new Sprite(START_SRC, 308, 48, window.canvasWidth / 2 - 154, window.canvasHeight - 120);
  fish = new Sprite(BACK_SRC, 64, 64, 0, 0);
  fish_row = Math.ceil(window.canvasHeight / 64) + 1;
  fish_col = Math.ceil(window.canvasWidth / 64) + 1;

  // todo check 这里发起请求 进行同步
  // await syncCloudUserInfo();
  bindCheckLoaded("sync");
  console.log("是这里卡吗");
}

export function destroy() {
  logo = null;
  start = null;
  fish = null;
}

// 检查资源加载进度
export function checkProgress(allAssets) {
  const arr = Object.values(allAssets);
  const numerator = Object.values(allAssets).reduce((res, item) => {
    return res + (item ? 1 : 0);
  }, 0);

  progress = numerator / arr.length;
}

export function renderLoading(ctx, isDone) {
  ctx.fillStyle = "#1d9fd0";
  console.log("渲染：", isDone);
  ctx.font = "12px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
  ctx.fillStyle = "#1d9fd0";
  ctx.fillRect(0, 0, window.canvasWidth, window.canvasHeight);
  ctx.fillStyle = "#ffffff";

  ctx.save();
  ctx.globalAlpha = Math.min(alpha, 1);

  // 画背景
  for (let i = 0; i < fish_row; i++) {
    for (let j = 0; j < fish_col; j++) {
      fish.drawToCanvasManual(ctx, (j - 1) * fish_size + fish_offset, i * fish_size - fish_offset);
    }
  }
  fish_offset += 1;
  if (fish_offset > 64) {
    fish_offset = 0;
  }

  logo.drawToCanvas(ctx);

  // 健康忠告
  let tInfo = ctx.measureText(t1);
  ctx.fillText(t1, window.canvasWidth / 2 - tInfo.width / 2, window.canvasHeight - 50);
  tInfo = ctx.measureText(t2);
  ctx.fillText(t2, window.canvasWidth / 2 - tInfo.width / 2, window.canvasHeight - 35);

  // loading和开始按钮
  if (isDone) {
    start.drawToCanvas(ctx);
  } else {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 11;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(window.canvasWidth / 2 - 100, window.canvasHeight - 120);
    ctx.lineTo(window.canvasWidth / 2 + 100, window.canvasHeight - 120);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "#5aa347";
    ctx.lineWidth = 8;
    ctx.moveTo(window.canvasWidth / 2 - 99, window.canvasHeight - 120);
    ctx.lineTo(window.canvasWidth / 2 - 99 + 198 * progress, window.canvasHeight - 120);
    ctx.stroke();
    ctx.closePath();
  }

  ctx.restore();
  alpha += 0.1;
}

export function checkClick(mouseX, mouseY) {
  if (start.isClick(mouseX, mouseY)) {
    return "start";
  }
}

export default {
  init,
  destroy,
  renderLoading,
  checkClick,
  checkProgress,
};
