/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = "", width = 0, height = 0, x = 0, y = 0, onLoaded) {
    this.img = new Image();
    this.img.onload = onLoaded;
    this.img.src = imgSrc;

    this.width = width;
    this.height = height;

    this.resetX = x;
    this.resetY = y;
    this.x = x;
    this.y = y;

    this.isLoaded = false;

    // 为了动画
    this.alpha = 0;
    this.left = -x - width;

    this.actions = [
      { name: "default", img: "", frame: 6, width: 20, step: 1 }, // 动作名称，动作的雪碧图，动作的帧率（每过6帧渲染一次）,单图片宽度，总共多少张单图
    ];

    // 为了点击效果
    this.clickOffset = 0;
  }

  /**
   * 重置精灵，为了动画
   */
  reset() {
    this.alpha = 0;
    this.left = -this.resetX - this.width;
  }

  /**
   * 将精灵图绘制在canvas上
   * @param ctx
   * @param ani opacity逐渐出现/left从左边滑入
   * */
  drawToCanvas(ctx, ani) {
    switch (ani) {
      case "opacity":
        if (this.alpha < 1) {
          ctx.save();
          ctx.globalAlpha = Math.min(this.alpha, 1);
          this.drawToCanvasManual(ctx, this.x, this.y);
          this.alpha += 0.1;
          ctx.restore();
        } else {
          this.drawToCanvasManual(ctx, this.x, this.y);
        }
        break;
      case "left":
        this.drawToCanvasManual(ctx, this.left, this.y);
        if (this.left < this.resetX) {
          this.left += 10;
        }
        break;
      default:
        this.drawToCanvasManual(ctx, this.x, this.y);
    }
  }

  /**
   * 根据手动定义的坐标，将精灵图绘制在canvas上
   * @param ctx
   * @param x
   * @param y
   */
  drawToCanvasManual(ctx, x, y) {
    ctx.drawImage(this.img, x, y + this.clickOffset, this.width, this.height);
    this.x = x;
    this.y = y;

    if (this.clickOffset > 0) {
      this.clickOffset--;
    }
  }

  // 以动画的形式移除
  removeToCanvas(ctx, ani) {
    switch (ani) {
      case "opacity":
        if (this.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.min(this.alpha, 1);
          this.drawToCanvasManual(ctx, this.x, this.y);
          this.alpha -= 0.1;
          this.alpha = Math.max(0, this.alpha);
          ctx.restore();
        }
        break;
      case "left":
        if (this.left > -this.width) {
          this.left -= 10;
          this.drawToCanvasManual(ctx, this.left, this.y);
        }
        break;
    }
  }

  // 是否点中检测
  isClick(mouseX, mouseY) {
    const isClick = !!(mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height);
    if (isClick) {
      this.clickOffset = 6;
      return true;
    }
    return false;
  }
}
