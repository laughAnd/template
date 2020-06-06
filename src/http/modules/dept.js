import axios from '../axios'

/* 
 * 部门管理模块
 */


//分页
export const findPage = data => {
  console.log(data)
  var para = "PageIndex=" + data.pageIndex + "&PageSize=" + data.pageSize + "&Search=" + data.search + "&OrderField=" + data.orderField;
  return axios({
    url: '/dept?' + para,
    method: 'get'
  })
}

//所有
export const list = () => {
  return axios({
    url: '/dept/list',
    method: 'get'
  })
}
//树
export const tree = () => {
  return axios({
    url: '/dept/tree',
    method: 'get'
  })
}

export const add = data => {
  return axios({
    url: '/dept',
    method: 'post',
    data
  })
}
export const edit = data => {
  return axios({
    url: '/dept',
    method: 'put',
    data
  })
}

export const del = (data) => {
  return axios({
    url: '/dept',
    method: 'delete',
    data
  })
}


