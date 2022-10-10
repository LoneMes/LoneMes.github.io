const openDataContext = wx.getOpenDataContext();

export function initRank(successData) {
  sharedCanvas = openDataContext.canvas;
  sharedCanvas.width = 320 * 2;
  sharedCanvas.height = 600 * 2;
  // console.log('设置了sharedCanvase', sharedCanvas.width, sharedCanvas.height);

  openDataContext.postMessage({
    func: "initRank",
    successData,
  });
}

// 绘制一帧shareCanvas
export function drawCanvas() {
  openDataContext.postMessage({
    func: "draw",
  });
}

export default {
  initRank,
  drawCanvas,
};
