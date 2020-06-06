import axios from '../axios'

/* 
 * 数据字典
 */

//分页
export const findPage = data => {
  console.log(data)
  var para = "PageIndex=" + data.pageIndex + "&PageSize=" + data.pageSize + "&Search=" + data.search + "&OrderField=" + data.orderField;
  return axios({
    url: '/dict?' + para,
    method: 'get'
  })
}

//所有一级下拉  name='base'
export const list = (name) => {
  return axios({
    url: '/dict/' + name,
    method: 'get'
  })
}

//all dict
export const all = () => {
  return axios({
    url: '/dict/all',
    method: 'get'
  })
}

export const add = data => {
  return axios({
    url: '/dict',
    method: 'post',
    data
  })
}
export const edit = data => {
  return axios({
    url: '/dict',
    method: 'put',
    data
  })
}

export const del = (data) => {
  return axios({
    url: '/dict',
    method: 'delete',
    data
  })
}




