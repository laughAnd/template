import axios from '../axios'

/* 
 * 角色权限
 */

//分页
export const findPage = data => {
  console.log(data)
  var para = "PageIndex=" + data.pageIndex + "&PageSize=" + data.pageSize + "&Search=" + data.search + "&OrderField=" + data.orderField;
  return axios({
    url: '/role?' + para,
    method: 'get'
  })
}

//所有
export const list = () => {
  return axios({
    url: '/role/list',
    method: 'get'
  })
}
//树
export const tree = () => {
  return axios({
    url: '/role/tree',
    method: 'get'
  })
}

export const addAuth = (roleId, data) => {
  return axios({
    url: '/role/' + roleId + '/auth',
    method: 'post',
    data
  })
}

export const add = data => {
  return axios({
    url: '/role',
    method: 'post',
    data
  })
}
export const edit = data => {
  return axios({
    url: '/role',
    method: 'put',
    data
  })
}

export const del = (data) => {
  return axios({
    url: '/role',
    method: 'delete',
    data
  })
}




