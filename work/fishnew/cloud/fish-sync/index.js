// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('云函数-入参：', event);
  try{
    const wxContext = cloud.getWXContext();

    if(!wxContext.OPENID) return;
  
    const collection = db.collection('userInfos');
      const userCloud = await collection.where({
        openid: wxContext.OPENID
      }).get();
      console.log('得到了啥：', userCloud);
  
      // 本地传过来一定是有的
      let lastData;
  
      if(!userCloud.data[0]){
         // 如果云上没有，则本地覆盖云
        lastData = {
          ...event,
          openid: wxContext.OPENID,
          syncDate: Date.now(), // 服务器的时间戳
        }
        collection.add({
          data: lastData,
        });
        return lastData;
      } else {
         // 如果云上有，则比较本地和云的时间
        const cloudData = userCloud.data[0];
        const localData = event;
  
        lastData = cloudData.syncDate > localData.syncDate ? cloudData : localData;

        // 如果本地较新，就用本地覆盖云
        if(cloudData.syncDate < localData.syncDate){
          console.log('本地覆盖云');
          collection.doc(cloudData._id).set({data: lastData});
        }

        return lastData;
      }
    }catch(err){
      console.log('云函数发生错误');
      return false;
    }
    // return {
    //   event,
    //   openid: wxContext.OPENID,
    //   appid: wxContext.APPID,
    //   unionid: wxContext.UNIONID,
    //   userCloud,
    // }
  }