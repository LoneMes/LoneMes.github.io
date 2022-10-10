/**
 * 所有的鱼物料
 * id: number 鱼的类别，根据鱼的类别确定鱼的图片 以及其他信息
 * name: string 鱼的名字
 * src: string, 图片路径
 * growSpeed: 1, 成长速度
 * foodSpeed: 1, 食物消耗速度
 *
 */
export const fishList = [
  { id: 1, name: "蓝色小丑鱼", src: "images/gameing/fish1.png", growSpeed: 2, foodSpeed: 0.8, o2Speed: 1 },
  { id: 2, name: "黄色小丑鱼", src: "images/gameing/fish2.png", growSpeed: 1.1, foodSpeed: 1.2, o2Speed: 0.8 },
  { id: 3, name: "红色小丑鱼", src: "images/gameing/fish3.png", growSpeed: 1.2, foodSpeed: 0.8, o2Speed: 1.2 },
  { id: 4, name: "花瓣鱼", src: "images/gameing/fish4.png", growSpeed: 1, foodSpeed: 1.1, o2Speed: 1 },
  { id: 5, name: "灯笼鱼", src: "images/gameing/fish5.png", growSpeed: 1.4, foodSpeed: 1.4, o2Speed: 0.6 },
  { id: 6, name: "热水袋鱼", src: "images/gameing/fish6.png", growSpeed: 1.2, foodSpeed: 1, o2Speed: 1.2 },
  { id: 7, name: "海龟", src: "images/gameing/fish7.png", growSpeed: 0.8, foodSpeed: 1.2, o2Speed: 1 },
  { id: 8, name: "胖头鱼", src: "images/gameing/fish8.png", growSpeed: 1.2, foodSpeed: 1.1, o2Speed: 1.2 },
  { id: 9, name: "魔鬼鱼", src: "images/gameing/fish9.png", growSpeed: 1.6, foodSpeed: 1.3, o2Speed: 0.8 },
  { id: 10, name: "金枪鱼", src: "images/gameing/fish10.png", growSpeed: 1.4, foodSpeed: 1.2, o2Speed: 1 },
  { id: 11, name: "海马", src: "images/gameing/fish11.png", growSpeed: 0.6, foodSpeed: 0.5, o2Speed: 1.2 },
  { id: 12, name: "河豚", src: "images/gameing/fish12.png", growSpeed: 1, foodSpeed: 0.5, o2Speed: 1.5 },
  { id: 13, name: "乌贼", src: "images/gameing/fish13.png", growSpeed: 1.2, foodSpeed: 1.2, o2Speed: 1.2 },
  { id: 14, name: "翻车鱼", src: "images/gameing/fish14.png", growSpeed: 1.2, foodSpeed: 2, o2Speed: 1 },
  { id: 15, name: "黄金鱼", src: "images/gameing/fish15.png", growSpeed: 0.5, foodSpeed: 2, o2Speed: 0.2 },
];

/**
 * 道具对象
 * name: string,
 * type: string, 道具类别，根据道具类别确定图片/位置/缩放等信息
 */

// 用户游戏数据
let userGameInfo = null;

// 获取用户游戏数据
export function getUserGameInfo() {
  if (userGameInfo) return userGameInfo;

  let res = window.localStorage.getItem("user-game-info") || null;
  res = JSON.parse(res);

  if (!res) {
    res = {
      syncDate: 0, // 云同步的时间
      prevLogin: "0", // 上一次登录的时间
      o2: 100, // 氧气百分比
      clean: 100, // 清洁度百分比
      food: 0, // 拥有的面包
      passTime: 0, // 通关了多少次
      tasks: {
        // 新手引导任务
        task1: {
          isSuccess: false, // 任务是否完成
          isFirst: true, // 是否是首次，首次的话需要显示任务引导
        },
        // 每日首胜任务
        taskToday: {
          prevSuccess: "0", // 上一次完成的时间
          isFirst: true, // 是否是第一次做这个任务，首次的话对话不一样
        },
      },
      fishs: null, // 所有拥有的鱼情况
      fishUpdateDate: null, // 鱼情况的更新时间
      stages: [], // 拥有的道具
    };
    setGameInfo(res, "no-time");
  }
  return res;
}

// 同步用户游戏数据 更新所有数据
export function syncGameInfo() {
  const user = getUserGameInfo("syncGameInfo");

  // console.log("此时得到的user", user.clean);
  const timeNow = Date.now();
  const timePass = Math.max(Math.round((timeNow - (user.fishUpdateDate || timeNow)) / 1000), 0); // 过了这么久时间 单位：秒

  /**
   * 先更新鱼经验值
   */
  let o2Speed = 1.1;
  if (user.o2 < 60) {
    o2Speed = 1;
  } else if (user.o2 < 20) {
    o2Speed = 0.5;
  }

  let cleanSpeed = 1.1;
  if (user.clean < 60) {
    cleanSpeed = 1;
  } else if (user.clean < 20) {
    cleanSpeed = 0.5;
  }

  let foodSpeed = 1;
  if (user.food <= 0) {
    foodSpeed = 0.2;
  }

  /**
   *  每天有86400秒
   *  再更新面包等信息， 面包根据每条鱼的食量减少，清洁度每过一段时间减少，o2根据鱼的数量减（-）和道具提升（+）处理
   *  面包：根据每条鱼的食量，每秒减少
   *  o2: 基础增长每秒1， 每条鱼每秒基础消耗0.01， 随着鱼经验值增加而增加，封顶0.02
   *  清洁度：每过1秒下降0.1，随着鱼的数量增加而增加；todo 每天首次登录送50%;
   */

  const fishs = user.fishs || [];
  let foodConsume = 0;
  let cleanConsume = timePass * (0.001 + (fishs.length || 0) * 0.001) * 0.5; // 每秒下降0.01， 一天就是下降86.4，*0.5，每天下降43.2， 氧气总含量100
  let o2Consume = 0;

  for (let i = 0; i < fishs.length; i++) {
    const f = fishs[i];
    const ff = fishList.find(item => item.id === f.id);
    if (!ff) continue;

    const updateExp = timePass * ff.growSpeed * o2Speed * cleanSpeed * foodSpeed * 0.01; // 获得经验，过去的秒数 * 基础成长速度 * o2含量 * 清洁度含量 * 食物含量，每天涨864经验值
    f.exp = f.exp + updateExp;

    foodConsume += timePass * ff.foodSpeed * 0.001;
    o2Consume = timePass * (ff.o2Speed * 0.1 + Math.min(f.exp / 108000, 0.1));
  }

  o2Consume -= timePass; // 每秒回复氧气1， 所以这里-timePass

  // console.log("本次同步：", timePass, foodConsume, o2Consume, cleanConsume);
  // console.log("同步之前的clean:", user.clean);
  user.food = Math.min(Math.max(0, user.food - foodConsume), 99999999);
  user.o2 = Math.min(Math.max(0, user.o2 - o2Consume), 100);
  user.clean = Math.max(0, user.clean - cleanConsume);
  user.fishUpdateDate = timeNow;

  // console.log("sync done:", user);
  setGameInfo(user, "syncGameInfo");
  return user;
}

// 设置用户游戏数据
export function setGameInfo(newData, type) {
  // console.log("设置Userinfo:", type, newData.clean);

  // 设置前检查数据有效性
  newData.o2 = Math.min(Math.max(0, newData.o2), 100) || 0;
  newData.clean = Math.min(Math.max(0, newData.clean), 100) || 0;

  // 更新sync时间
  if (type !== "no-time") {
    newData.syncDate = Date.now();
  }

  userGameInfo = newData;
  window.localStorage.setItem("user-game-info", JSON.stringify(newData));
  return userGameInfo;
}

// 云同步
// export async function syncCloudUserInfo() {
//   const user = getUserGameInfo("syncCloudUserInfo");
//   const res = await wx.cloud.callFunction({
//     name: "fish-sync",
//     data: { syncDate: Date.now(), ...user },
//   });
//   console.log("云函数返回了什么", res);
//   if (res?.result) {
//     setGameInfo(res.result, "no-time");
//   }
// }

export default {
  fishList,
  getUserGameInfo,
  syncGameInfo,
  setGameInfo,
  userGameInfo,
};
