import axios from '../axios'

/* 
 * 客户
 */



//下拉
export const number = () => {
  return axios({
    url: '/statistic/number',
    method: 'get'
  })
}

//客户上周每天短信数量
export const line = () => {
  return axios({
    url: '/statistic/line',
    method: 'get'
  })
}

//客户短信占比
export const pie = () => {
  return axios({
    url: '/statistic/pie',
    method: 'get'
  })
}

//客户上周每天短信数量
export const bar = () => {
  return axios({
    url: '/statistic/bar',
    method: 'get'
  })
}

//每天短信总数量
export const lineTotal = () => {
  return axios({
    url: '/statistic/total',
    method: 'get'
  })
}


