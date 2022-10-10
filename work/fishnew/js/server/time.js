let startTime = null; // 游戏启动时的时间，是接口获取一次
let promiseTemp;

export function getServerTime() {
  return Date.now();
}

export default { getServerTime };
