import Sprite from "./sprite";

const sharedCanvas = wx.getSharedCanvas();
const ctx = sharedCanvas.getContext("2d");

const imgCanvas = wx.createCanvas();
const ctx2 = imgCanvas.getContext("2d");

imgCanvas.width = 100;
imgCanvas.height = 100;

let rankData = []; // 好友排行榜数据

/**================
 * 接受主线程消息
================*/
wx.onMessage(data => {
  switch (data.func) {
    case "initRank":
      updateUserScope(data.successData).then(() => {
        initRank();
      });
      break;
    case "draw":
      drawRank();
  }
});

/** ================
 * 更新用户数据 现在应该存储通关的次数 和 最大的一条鱼的数据
 * @param successData {score, fishName, weight, passTime, exp} 分数、最大的鱼名字、重量、通关次数,最高的经验值
 * ================ **/
async function updateUserScope(successData) {
  // console.log("开始更新开放与：", successData);

  await new Promise((resP, rejP) => {
    wx.removeUserCloudStorage({
      keyList: ["times", "level", "maxFishName", "maxExp"],
      success() {
        resP();
      },
      fail() {
        resP();
      },
    });
  });

  const scoreInfo = await new Promise((resP, rejP) => {
    try {
      wx.getUserCloudStorage({
        keyList: ["times", "level", "maxFishName", "maxExp"], // fishName最大的鱼名字， level历史上最大的斤数(之前是分数)， times通关次数
        success(res) {
          // console.log("cloud返回了什么：", res);
          let prevTimes = 0;
          let prevMaxExp = 0;
          let prevLevel = "1两";
          let prevMaxFishName = "";

          if (res.KVDataList[3]) {
            prevMaxExp = Number(res.KVDataList[3].value) || 0;
          }
          if (res.KVDataList[2]) {
            prevMaxFishName = res.KVDataList[2].value;
          }
          if (res.KVDataList[1]) {
            prevLevel = res.KVDataList[1].value;
          }
          if (res.KVDataList[0]) {
            prevTimes = Number(res.KVDataList[0].value) || 0;
          }

          let levelNow = prevLevel;
          let expNow = prevMaxExp;
          let fishNameNow = prevMaxFishName;
          const timesNow = successData.passTime > prevTimes ? successData.passTime : prevTimes;

          if (successData.exp >= prevMaxExp) {
            expNow = successData.exp;
            fishNameNow = successData.fishName;
            levelNow = successData.weight;
          }

          resP({ levelNow, timesNow, expNow, fishNameNow, score: successData.score });
        },
        fail() {
          rejP();
        },
      });
    } catch (err) {
      return { levelNow: successData.weight, timesNow: 1, expNow: successData.exp, fishNameNow: successData.fishName, score: successData.score };
    }
  });

  await new Promise(res => {
    wx.setUserCloudStorage({
      KVDataList: [
        { key: "level", value: scoreInfo.levelNow },
        { key: "times", value: String(scoreInfo.timesNow) },
        { key: "maxFishName", value: scoreInfo.fishNameNow },
        { key: "maxExp", value: String(scoreInfo.expNow) },
      ],
      success() {
        console.info("分数更新成功", scoreInfo);
      },
      fail(err) {
        console.info("分数更新失败", err, scoreInfo);
      },
      complete() {
        res();
      },
    });
  });
}

/** ================
 * 获取好友排行榜数据列表
 * ================ **/
function initRank() {
  ctx.scale(2, 2);
  wx.getFriendCloudStorage({
    keyList: ["level", "times", "maxFishName", "maxExp"],
    success: msg => {
      rankData = msg.data;
      rankData = rankData.slice(0, 10);
      rankData.sort((a, b) => {
        // 最大的鱼的经验值排序
        const valueA = Number(a.KVDataList[3].value);
        const valueB = Number(b.KVDataList[3].value);

        // 如果一样，则按照通关次数排序
        const TimeA = Number(a.KVDataList[1].value);
        const TimeB = Number(b.KVDataList[1].value);

        if (valueA > valueB) {
          return -1;
        } else if (valueA < valueB) {
          return 1;
        } else {
          if (TimeA > TimeB) {
            return -1;
          } else {
            return 1;
          }
        }
      });
    },
    fail: err => {
      console.info("失败：", err);
      rankData = [];
    },
    complete() {
      makeRankData();
    },
  });
}

// 处理排行榜数据，坐标
let imgBack;
let rankDataImgs = [];
function makeRankData() {
  rankDataImgs = [];

  for (let i = 0; i < rankData.length; i++) {
    let x = 0;
    let y = 0;
    if (i === 0) {
      x = sharedCanvas.width / 2 - 50;
      y = 20;
    }
    rankDataImgs.push(new Sprite(rankData[i].avatarUrl, 100, 100, x, y));
  }

  if (!imgBack) {
    imgBack = new Sprite("packageSuccess/assets/rank-back.png", 320, 600, sharedCanvas.width / 4 - 160, sharedCanvas.height / 4 - 300, () => drawRank());
  } else {
    drawRank();
  }
}

// 真正的绘制一帧 level", "times", "maxFishName", "maxExp"
function drawRank() {
  ctx.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
  imgBack.drawToCanvas(ctx);

  ctx.fillStyle = "#fff";
  let offset = 42;

  rankDataImgs.forEach((item, index) => {
    const sourceData = rankData[index];

    ctx.font = "16px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";

    const timeStr = `${sourceData.KVDataList[1]?.value || 1}次`;
    const levelStr = sourceData.KVDataList[0]?.value || "";
    const nameStr = sourceData.KVDataList[2]?.value || "";
    const nameInfo = ctx.measureText(nameStr);
    const timesInfo = ctx.measureText(timeStr);
    const levelInfo = ctx.measureText(levelStr);

    const fishName = sourceData.KVDataList[2]?.value || "";

    const left = sharedCanvas.width / 4 - 160;
    const top = sharedCanvas.height / 4 - 105;

    ctx2.fillStyle = "#f00";
    ctx2.clearRect(0, 0, 100, 100);
    ctx2.save();
    item.drawToCanvasSource(ctx2);
    ctx2.globalCompositeOperation = "destination-in";

    ctx2.beginPath();
    ctx2.arc(50, 50, 50, 0, Math.PI * 2);
    ctx2.closePath();
    ctx2.fill();
    ctx2.restore();

    ctx.drawImage(imgCanvas, left + 25, top + offset * index - 24, 36, 36);

    ctx.fillText(`${index + 1}.`, left + 5, top + offset * index);
    ctx.fillText(sourceData.nickname, left + 70, top + offset * index);

    ctx.fillText(timeStr, left + 200 - timesInfo.width, top + offset * index);
    ctx.fillText(levelStr, left + 300 - levelInfo.width, top + offset * index + 20);
    ctx.fillText(fishName, left + 300 - nameInfo.width, top + offset * index);
  });
}
