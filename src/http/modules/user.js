import axios from '../axios'

/* 
 * 用户管理模块
 */


export const findPage = data => {
  var para = "PageIndex=" + data.pageIndex + "&PageSize=" + data.pageSize + "&Search=" + data.search + "&OrderField=" + data.orderField;
  return axios({
    url: '/user?' + para,
    method: 'get'
  })
}


export const add = data => {
  return axios({
    url: '/user',
    method: 'post',
    data
  })
}
export const edit = data => {
  return axios({
    url: '/user',
    method: 'put',
    data
  })
}

export const password = data => {
  return axios({
    url: '/user/password',
    method: 'put',
    data
  })
}


export const del = (data) => {
  return axios({
    url: '/user',
    method: 'delete',
    data
  })
}

export const findPermissions = (data) => {
  return axios({
    url: '/user/perms?name=' + data.name,
    method: 'get'
  })
}
