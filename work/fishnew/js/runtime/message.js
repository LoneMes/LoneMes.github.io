let messages = [];
const yOffset = 24;

export function push(str) {
  messages.push({ str, step: 0 });
  if (messages.length > 10) {
    messages.shift();
  }
}

export function render(ctx) {
  clearTimeoutStr();
  if (!messages.length) return;

  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Patrick Hand, -apple-system, BlinkMacSystemFont, PingFang SC, sans-serif";

  messages.reverse();
  for (let i = 0; i < messages.length; i++) {
    const y = window.canvasHeight - 160 - yOffset * i;
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.4;
    const w = ctx.measureText(messages[i].str);
    ctx.fillRect(0, y - 18, w.width + 10, 24);
    ctx.restore();

    ctx.fillText(messages[i].str, 5, y);
    messages[i].step += 1;
  }
  messages.reverse();
}

// 清理超时的消息 300帧，5秒
function clearTimeoutStr() {
  messages = messages.filter(item => {
    return item.step < 300;
  });
}

export default {
  push,
  render,
};
