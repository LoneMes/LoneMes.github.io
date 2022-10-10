// 工具 - 设置图片尺寸cover方式贴合canvas尺寸 w/h
export function makeImgSize(imgWidth, imgHeight, canvasWidth, canvasHeight) {
  const imgScale = imgWidth / imgHeight;
  const canvasScale = canvasWidth / canvasHeight;
  let x = 0,
    y = 0,
    w = 0,
    h = 0;
  if (imgScale > canvasScale) {
    h = canvasHeight;
    w = imgScale * h;
    y = 0;
    x = (canvasWidth - w) / 2;
  } else {
    w = canvasWidth;
    h = w / imgScale;
    x = 0;
    y = (canvasHeight - h) / 2;
  }
  return [x, y, w, h];
}

// 工具 - 设置图片尺寸co方式贴合canvas尺寸 w/h
export function makeImgSize2(imgWidth, imgHeight, boxWidth, boxHeight) {
  const imgScale = imgWidth / imgHeight;
  const canvasScale = boxWidth / boxHeight;
  let x = 0,
    y = 0,
    w = 0,
    h = 0;
  if (imgScale > canvasScale) {
    // 图片宽度更大
    w = boxWidth;
    h = w / imgScale;
    x = 0;
    y = (boxHeight - h) / 2;
  } else {
    // 图片高度更大
    h = boxHeight;
    w = imgScale * h;
    y = 0;
    x = (boxWidth - w) / 2;
  }
  return [x, y, w, h];
}

/** 取范围随机数 整数 **/
export function random(min, max, isRound = true) {
  const r = Math.random() * (max - min) + min;
  if (isRound) {
    return Math.round(r);
  }
  return r;
}

// 工具- 判断时间是否和当前日期相等
export function checkTimeEquals(prevLogin) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  return [todayStr !== prevLogin, todayStr];
}

// 获取当前时间，格式化的样子 （主要用于判断今日任务）
export function getTodayStr() {
  const today = new Date();
  return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
}

// 根据经验值得到鱼的重量
export function getFishWeight(exp) {
  let liang = 1 + exp / 1000; // 两

  if (liang < 10) {
    return `${liang.toFixed(2)}两`;
  }

  if (liang < 20000) {
    const jin = Math.floor(liang / 10);
    const l = Math.floor(liang - jin * 10);
    return `${jin}斤${l}两`;
  }

  const dun = Math.floor(liang / 20000); // 1吨 = 2000斤； 1斤 = 10两
  const jin = Math.floor((liang - dun * 2000) / 10);
  const l = Math.floor(liang - dun * 20000 - jin * 10);

  return `${dun}吨${jin}斤${l}两`;
}

// 格式化日期
export function formatTime(num) {
  const time = new Date(num);
  if (!time) {
    return "-";
  }
  return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;
}

// 获取一行能放下多少个字
let lineLength = 0;
export function getLineLength(ctx) {
  if (lineLength) return lineLength;
  let num = 0;
  let txtArr = "我";
  ctx.save();
  ctx.font = "18px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";
  for (let i = 0; true; i++) {
    if (ctx.measureText(txtArr).width > window.canvasWidth - 25) {
      num = i;
      break;
    } else {
      txtArr = `${txtArr}我`;
    }
  }
  ctx.restore();
  lineLength = num;
  return num;
}

export default {
  makeImgSize,
  makeImgSize2,
  random,
  checkTimeEquals,
  getTodayStr,
  getFishWeight,
  formatTime,
  getLineLength,
};
