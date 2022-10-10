// 装饰物控制器 目前主要是水中的泡泡
import Sprite from "../base/sprite.js";
import { random } from "../base/util.js";

const PAO_SRC = "/images/gameing/pao.png";

let pao;

const info = {
  pao: { x: random(0, window.canvasWidth - 100), y: window.canvasHeight, width: 39, height: 100, speed: 4 },
};

export function init() {
  pao = new Sprite(PAO_SRC, 39, 100, info.pao.x, info.pao.y);
}

export function render(ctx) {
  // 泡泡动画
  pao.y -= info.pao.speed;
  if (pao.y < -150) {
    info.pao.x = random(0, window.canvasWidth);
    info.pao.y = window.canvasHeight + 10;
    info.pao.speed = random(3, 8);
    pao.x = info.pao.x;
    pao.y = info.pao.y;
  }

  pao.drawToCanvas(ctx);
}

export default {
  init,
  render,
};
