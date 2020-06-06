//引入安装的signalr包
import $ from 'jquery'
import { hubUrl } from '@/utils/global'
import signalR from 'signalr'
import store from '@/store'

import { Message } from 'element-ui';
const HUBNAME = 'NoticeHub';

/*客户端调用服务器端方法*/
//注册
const register = {
  name: 'register',
  method: function (data) {
    console.log(data)
  }
}

/*服务器调用客户端方法*/
// 接收通知
// const showNotice = {
//   name: 'showNotice',
//   method: function (data) {
//     console.log("receive notice")
//     console.log(data)
//     // 保存通知消息
//     store.commit('setNoticeList', data)
//   }
// }

const showNotice = {
  name: 'showNotice',
  method: null
}

//服务器端的方法
const serverMethodSets = [register];
//客户端的方法
const clientMethodSets = [showNotice]; //将需要注册的方法放进集合

// 建立连接
export function startConnection(callBack) {
  let userId = sessionStorage.getItem('sms_id')
  let hub = $.hubConnection(hubUrl)
  let proxy = createHubProxy(hub, callBack) //需要先注册方法再连接
  hub.start().done((connection) => {
    var result = proxy.invoke("register", userId);
    console.log('Now connected, connection ID=' + connection.id)
    console.log(result);
  }).fail(() => {
    Message('连接失败' + error);
    console.log('Could not connect');
  })
  hub.error(function (error) {
    Message('SignalR error: ' + error);
    console.log('SignalR error: ' + error)
  })
  hub.connectionSlow(function () {
    console.log('We are currently experiencing difficulties with the connection.')
  });
  hub.disconnected(function () {
    console.log('disconnected')
  });
  return proxy
}
// 手动创建proxy
export function createHubProxy(hub, callBack) {
  let proxy = hub.createHubProxy(HUBNAME)
  // 注册客户端方法
  clientMethodSets.map((item) => {
    if (!item.method)
      item.method = callBack;
    proxy.on(item.name, item.method)
  })
  return proxy
}

