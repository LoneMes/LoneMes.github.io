import Sprite from "../base/sprite.js";
import { makeImgSize } from "../base/util.js";
const BG_IMG_SRC = "/images/assets/back1.jpg"; //"https://s1.ax1x.com/2022/09/19/x9y16s.jpg";
// const BG_IMG2_SRC = "https://s1.ax1x.com/2022/09/19/x9yllj.jpg";
// const BG_IMG3_SRC = "https://s1.ax1x.com/2022/09/19/x9yy0x.jpg";

let imgBack;

function initCover() {
  const winW = window.canvasWidth;
  const winH = window.canvasHeight - 160;

  const imgSize = makeImgSize(658, 1170, winW, winH);
  return imgSize;
}

export async function init(onLoaded) {
  let imgSize = initCover();
  imgBack = new Sprite(BG_IMG_SRC, imgSize[2], imgSize[3], imgSize[0], imgSize[1], () => onLoaded("back"));
}

export function render(ctx) {
  imgBack.drawToCanvas(ctx);
}

export default {
  init,
  imgBack,
  render,
};
