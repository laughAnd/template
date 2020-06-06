/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */



// 系统数据备份还原服务器地址
//export const backupBaseUrl = 'http://localhost:8002'

// 后台管理系统服务器地址
export const baseUrl = 'http://localhost/backend/api'
// 推送url
export const hubUrl = "http://localhost/backend/signalr/hubs"

export default {
  baseUrl,
  //backupBaseUrl,
  hubUrl
}