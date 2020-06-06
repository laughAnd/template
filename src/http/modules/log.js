import axios from '../axios'

/* 
 * 日志
 */

//分页
export const findPage = data => {
  var para = "PageIndex=" + data.pageIndex + "&PageSize=" + data.pageSize + "&Search=" + data.search + "&OrderField=" + data.orderField + "&Start=" + data.start + "&End=" + data.end;
  return axios({
    url: '/log?' + para,
    method: 'get'
  })
}

export const del = (data) => {
  return axios({
    url: '/log',
    method: 'delete',
    data
  })
}




