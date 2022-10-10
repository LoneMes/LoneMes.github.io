// 全局都要显示的UI
import Sprite from "../base/sprite.js";

const BTN_MUSIC_OPEN = "images/global/icon_music_open.png";
const BTN_MUSIC_CLOSE = "images/global/icon_music_close.png";

let btn_music;

export function init() {
  // 处理按钮
  const isCanPlay = window.localStorage.getItem("music-play") !== "false";
  btn_music = new Sprite(isCanPlay ? BTN_MUSIC_OPEN : BTN_MUSIC_CLOSE, 38, 38, window.canvasWidth - 5 - 38, 100);
}

// 渲染
export function render(ctx) {
  btn_music.drawToCanvas(ctx);
}

// 检查是否点击了某个按钮
export function checkClick(mouseX, mouseY) {
  if (btn_music.isClick(mouseX, mouseY)) {
    return "music";
  }
  return null;
}

// music type change
export function changeMusicBtn(type) {
  btn_music.img.src = type ? BTN_MUSIC_OPEN : BTN_MUSIC_CLOSE;
}

export default {
  init,
  render,
  checkClick,
  changeMusicBtn,
};
