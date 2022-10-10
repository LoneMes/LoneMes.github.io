import BackGround from "./runtime/background.js";
import Control from "./runtime/control.js";
import Music from "./runtime/music.js";
import Decorate from "./runtime/decorate.js";
import Success from "./runtime/success.js";
import GlobalUI from "./runtime/globalUI.js";
// import openService from "./runtime/openService";
import Loading from "./runtime/loading.js";
import FishServer from "./runtime/fish.js";
import MessageServer from "./runtime/message.js";
import FishListServer from "./runtime/fishList.js";
import * as ThreeCanvas from "./runtime/threeCanvas.js";
import { syncGameInfo } from "./materials/userinfo.js";

// 任务系统
import task1 from "./materials/task1.js"; // 新手任务逻辑
import taskToday from "./materials/taskToday.js"; // 每日任务

const canvas = document.getElementById("main-canvas");
console.log("main-canvas", canvas);
const ctx = canvas.getContext("2d");
// let timer;

// 必要的资源是否加载完毕
const allAssets = {
  back: false,
  backControl: false,
  btn1: false,
  task1back: false, // 新手任务的back
  sync: false, // 云同步是否完成
};

/**=======================================
 * 游戏主函数
======================================== */
export default class Main {
  constructor() {
    this.aniId = 0; // 帧循环的ID
    this.isDone = false; // 初始化是否完毕

    this.isPageShow = true; // 页面是否激活
    this.pageType = 1; // 1开始页面 2游戏中 3成功页面
    this.pageClickType = 0; // 为了区分同一个页面不同状态的点击

    this.init();

    this.bindGameSuccess = this.gameSuccess.bind(this);
    this.bindResize = this.windowResize.bind(this);

    ThreeCanvas.onLoad(this.bindGameSuccess);

    window.addEventListener("resize", this.bindResize, false);
    // console.log("加载完毕");
  }

  // 用户改变窗口大小
  windowResize() {
    const dpr = window.devicePixelRatio;
    const w = Math.min(window.innerWidth, 750);
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    window.canvasWidth = w;
    window.canvasHeight = h;
  }

  /**==================
   * 初始化
   * ================== **/
  async init() {
    this.windowResize();
    this.bindCheckLoaded = this.checkLoaded.bind(this);
    this.bindGameReset = this.gameReset.bind(this);

    // 先云同步
    await Loading.init(this.bindCheckLoaded);

    // 再本地更新本次启动后用户数据/经验值等
    syncGameInfo();

    BackGround.init(this.bindCheckLoaded);
    Control.init(this.bindCheckLoaded);
    Decorate.init();
    GlobalUI.init();
    task1.init(ctx, this.bindGameReset, this.bindCheckLoaded);
    taskToday.init(ctx);

    FishServer.init();
    FishListServer.init();
    this.music = new Music();

    // // touch事件
    this.touchHandler = this.onTouch.bind(this);
    canvas.addEventListener("touchstart", this.touchHandler);
    canvas.addEventListener("click", this.touchHandler);

    // 开始帧循环先
    this.bindLoop = this.loop.bind(this);
    this.startAnime();
  }

  // 检查资源是否全部加载完毕 两个背景和按钮加载完毕就认为完毕
  checkLoaded(type) {
    allAssets[type] = true;
    Loading.checkProgress(allAssets);
    const isOK = Object.values(allAssets).reduce((res, item) => {
      return res && item;
    }, true);
    if (!this.isDone && isOK) {
      this.isDone = true;
    }
  }

  // 开始帧循环
  startAnime() {
    window.cancelAnimationFrame(this.aniId);
    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }

  /**==================
   * 场景切换处理
   * ================== **/
  changeScene(next) {
    const prev = this.pageType;

    switch (prev) {
      case 1:
        Loading.destroy();
        break;
      case 2:
        break;
      case 3:
        Success.destroy();
        break;
    }

    switch (next) {
      case 1:
        Loading.init();
        break;
      case 2:
        Success.resetStartTime();
        Success.init(ctx);
        break;
      case 3:
        break;
    }

    this.pageType = next;
  }

  /**==================
   * 页面中的所有触摸事件
   * ================== **/
  onTouch(e) {
    e.preventDefault();
    // console.log(e);
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    const isSound = this.music.isPlaying();

    if (GlobalUI.checkClick(x, y) === "music") {
      GlobalUI.changeMusicBtn(!isSound);
      this.music.triggerBgm();
    }

    if (!this.isDone) return;

    if (this.pageType === 1) {
      // 游戏尚未开始时
      const type = Loading.checkClick(x, y);
      if (type === "start") {
        this.changeScene(2);
        task1.start();
      }
    } else if (this.pageType === 2) {
      // 游戏中打开鱼列表时，禁用其他点击
      if (FishListServer.getShow()) {
        FishListServer.checkClick(x, y);
        return;
      }

      task1.checkClick(x, y);
      if (task1.getTakling()) {
        return;
      }

      taskToday.checkClick(x, y);
      if (taskToday.getTakling()) {
        return;
      }

      const type = Control.checkClick(x, y);
      switch (type) {
        case "left":
          ThreeCanvas.onBtnClick("left");
          isSound && this.music.playBtn();
          break;
        case "right":
          ThreeCanvas.onBtnClick("right");
          isSound && this.music.playBtn();
          break;
        case "reset":
          window.cancelAnimationFrame(this.aniId);
          ThreeCanvas.onReset();

          this.startAnime();
          Success.resetStartTime();
          break;
        case "list":
          FishListServer.setShow(true);
      }
    } else if (this.pageType === 3) {
      // 游戏已进入成功界面
      const type = Success.checkClick(x, y);
      switch (type) {
        case "again":
          // this.stopDrawRank();
          window.cancelAnimationFrame(this.aniId);
          this.changeScene(2);
          this.music.playBgm();
          ThreeCanvas.onReset();
          this.startAnime();
          break;
      }
    }
  }

  // 游戏成功
  gameSuccess() {
    this.changeScene(3);

    this.music.stopBgm();
    this.music.playSuccess();

    taskToday.checkTaskSuccess();

    // 需要计算用户的用时，得到分数，成功页需要显示分数
    const successData = Success.getScore(Date.now());
    // openService.initRank(successData);
  }

  // 重新开始游戏
  gameReset() {
    ThreeCanvas.onReset();
    Success.resetStartTime();
  }

  /**=======================
   * 绘制一帧
   * 每一帧重新绘制所有的需要展示的元素
   ========================= **/
  render() {
    if (!this.isPageShow) return;

    BackGround.render(ctx);
    FishServer.render(ctx);
    Decorate.render(ctx);
    ThreeCanvas.render(ctx);
    Control.render(ctx);

    taskToday.render(ctx);
    task1.render(ctx);

    FishListServer.render(ctx, this.pageClickType === 1);
  }

  /** =========================
   * 实现游戏帧循环
  ========================= **/
  loop() {
    switch (this.pageType) {
      case 1:
        Loading.renderLoading(ctx, this.isDone);
        break;
      case 2:
        this.render();
        break;
      case 3:
        Success.render(ctx);
    }
    GlobalUI.render(ctx);
    MessageServer.render(ctx);

    this.aniId = window.requestAnimationFrame(this.bindLoop, canvas);
  }
}
