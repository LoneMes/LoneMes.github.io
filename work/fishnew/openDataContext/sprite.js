/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0, onLoaded) {
    this.img = document.createElement("img");
    this.img.onload = onLoaded;
    this.img.src = imgSrc

    this.width = width
    this.height = height

    this.x = x
    this.y = y

    this.isLoaded = false;
  }

  drawToCanvasSource(ctx) {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height
    )
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
