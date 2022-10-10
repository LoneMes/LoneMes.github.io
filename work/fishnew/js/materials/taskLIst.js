const list = [];

export function push(taskData) {
  const taskIndex = list.findIndex(item => item.id === taskData.id);
  if (taskIndex === -1) {
    list.push(taskData);
  }

  postMessage();
  return list;
}

export function del(id) {
  const taskIndex = list.findIndex(item => item.id === id);
  list.splice(taskIndex, 1);
  postMessage();
  return list;
}

export function getIndex(id) {
  return list.findIndex(item => item.id === id);
}

// 向所有注册的监听发送信息
function postMessage() {
  for (let i = 0; i < list.length; i++) {
    list[i].callback?.(i);
  }
}

export default {
  push,
  del,
  getIndex,
};
